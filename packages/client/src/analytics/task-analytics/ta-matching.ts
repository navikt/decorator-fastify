import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
    taskAnalyticsGetState,
    taskAnalyticsSetSurveyMatched,
} from "./ta-cookies";
import { Context } from "decorator-shared/params";
import {
    TaskAnalyticsSurvey,
    TaskAnalyticsUrlRule,
} from "decorator-server/src/task-analytics-config";

dayjs.extend(utc);
dayjs.extend(timezone);

const norwayTz = "Europe/Oslo";

type Audience = Required<TaskAnalyticsSurvey>["audience"][number];
type Language = Required<TaskAnalyticsSurvey>["language"][number];
type Duration = TaskAnalyticsSurvey["duration"];

const removeTrailingSlash = (str: string) => str.replace(/\/$/, "");

const isMatchingUrl = (
    url: string,
    currentUrl: string,
    match: TaskAnalyticsUrlRule["match"],
) => (match === "startsWith" ? currentUrl.startsWith(url) : currentUrl === url);

const isMatchingUrls = (urls: TaskAnalyticsUrlRule[]) => {
    const currentUrlStr = removeTrailingSlash(
        `${window.location.origin}${window.location.pathname}`,
    );

    let isMatched: boolean | null = null;
    let isExcluded = false;

    urls.every((urlRule) => {
        const { url, match, exclude } = urlRule;
        const urlToMatch = removeTrailingSlash(url);

        if (isMatchingUrl(urlToMatch, currentUrlStr, match)) {
            // If the url is excluded we can stop. If not, we need to continue checking the url-array, in case
            // there are exclusions in the rest of the array
            if (exclude) {
                isExcluded = true;
                return false;
            } else {
                isMatched = true;
            }
        } else if (!exclude) {
            // If there was a previous match, keep the true value
            // This handles the case where the url-array contains only excluded urls
            isMatched = isMatched || false;
        }

        return true;
    });

    return !(isExcluded || isMatched === false);
};

const isMatchingAudience = (currentAudience: Audience, audience?: Audience[]) =>
    !audience || audience.some((a) => a === currentAudience);

const isMatchingLanguage = (currentLanguage: Language, language?: Language[]) =>
    !language || language.some((lang) => lang === currentLanguage);

const isMatchingDuration = (duration: Duration) => {
    if (!duration) {
        return true;
    }

    const { start, end } = duration;
    const now = dayjs().tz(norwayTz);

    return (
        (!start || now.isAfter(dayjs.tz(start, norwayTz))) &&
        (!end || now.isBefore(dayjs.tz(end, norwayTz)))
    );
};

export const taskAnalyticsIsMatchingSurvey = (
    survey: TaskAnalyticsSurvey,
    currentLanguage: Language,
    currentAudience: Audience,
) => {
    const { urls, audience, language, duration } = survey;

    return (
        (!urls || isMatchingUrls(urls)) &&
        isMatchingAudience(currentAudience, audience) &&
        isMatchingLanguage(currentLanguage, language) &&
        isMatchingDuration(duration)
    );
};

export const taskAnalyticsGetMatchingSurveys = (
    surveys: TaskAnalyticsSurvey[],
    currentLanguage: Language,
    currentAudience: Context,
) => {
    const { matched: prevMatched = {} } = taskAnalyticsGetState();

    const matchingSurveys = surveys.filter((survey) => {
        const { id } = survey;
        if (!id) {
            console.log("No TA survey id specified!");
            return false;
        }

        if (prevMatched[id]) {
            return false;
        }

        const isMatching = taskAnalyticsIsMatchingSurvey(
            survey,
            currentLanguage,
            currentAudience,
        );
        if (!isMatching) {
            return false;
        }

        taskAnalyticsSetSurveyMatched(id);

        return true;
    });

    return matchingSurveys.length === 0 ? null : matchingSurveys;
};
