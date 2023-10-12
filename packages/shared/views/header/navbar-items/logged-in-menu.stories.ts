import type { StoryObj, Meta } from '@storybook/html';
import type { LoggedInMenuProps } from './logged-in-menu';
import { LoggedInMenu } from './logged-in-menu';
import { initLoggedInMenu } from 'decorator-client/src/views/logged-in-menu';

const meta: Meta<LoggedInMenuProps> = {
  title: 'header/logged-in-menu',
  tags: ['autodocs'],
  render: (args) => {
    setTimeout(initLoggedInMenu, 1000);
    return LoggedInMenu(args);
  },
};

export default meta;
type Story = StoryObj<LoggedInMenuProps>;

export const Default: Story = {
  args: {
    name: 'LOKAL MOCK',
    myPageMenu: [
      {
        displayName: 'Din oversikt',
        path: '',
        isMyPageMenu: true,
        id: '87902576-3ce1-48bb-88bd-798d04352984',
        children: [
          {
            displayName: 'Dokumentarkiv',
            path: 'https://person.nav.no/mine-saker',
            flatten: false,
            isMyPageMenu: true,
            id: '15e2dca8-a68c-484a-b7fe-5ec9fe7ed7bb',
            children: [],
          },
          {
            displayName: 'Din innboks',
            path: 'https://innboks.nav.no/',
            isMyPageMenu: true,
            id: '79ae75ad-7473-4414-b411-129151107f4b',
            children: [],
          },
          {
            displayName: 'Dine utbetalinger',
            path: 'https://tjenester.nav.no/utbetalingsoversikt/',
            isMyPageMenu: true,
            id: '2462c7e9-6497-4d5d-bb05-d129a3f599d5',
            children: [],
          },
          {
            displayName: 'Endre kontonummer/adresse',
            path: '/person/personopplysninger/nb/#utbetaling',
            isMyPageMenu: true,
            id: '43783128-3ebb-44c9-aec4-3d8a6b2e457d',
            children: [],
          },
          {
            displayName: 'Send ny søknad',
            path: '/soknader',
            isMyPageMenu: true,
            id: '5e691c9d-9943-439c-b36e-f8691a774629',
            children: [],
          },
          {
            displayName: 'Ettersend vedlegg',
            path: '/ettersendelse',
            isMyPageMenu: true,
            id: 'f357124c-f599-42d9-85de-b02563fd09c0',
            children: [],
          },
          {
            displayName: 'Send beskjed til NAV',
            path: '/person/kontakt-oss/',
            isMyPageMenu: true,
            id: 'b9f87d61-967a-46fa-95e6-395824252644',
            children: [],
          },
          {
            displayName: 'Personopplysninger',
            path: '/person/personopplysninger',
            isMyPageMenu: true,
            id: '29bb2934-dc1b-44fe-9349-f427243fcd76',
            children: [],
          },
        ],
      },
      {
        displayName: 'Arbeid',
        path: '',
        isMyPageMenu: true,
        id: 'a6d04c66-3f5b-431f-8db3-420b25aa3a75',
        children: [
          {
            displayName: 'Registrer deg som arbeidssøker',
            path: 'https://www.nav.no/arbeid/registrering/',
            isMyPageMenu: true,
            id: 'd01301f4-e83d-4358-9ef7-4184c00c52bd',
            children: [],
          },
          {
            displayName: 'Send meldekort',
            path: '/meldekort/',
            isMyPageMenu: true,
            id: '6f75ca5c-0736-4cb3-95b2-fb2565ac73ae',
            children: [],
          },
          {
            displayName: 'Finn ledige stillinger',
            path: 'https://arbeidsplassen.nav.no/stillinger',
            isMyPageMenu: true,
            id: 'd1500b8b-7afa-429c-8b52-e48c73e24c2d',
            children: [],
          },
          {
            displayName: 'Din CV',
            path: 'https://arbeidsplassen.nav.no/minside',
            isMyPageMenu: true,
            id: 'd10cdf61-dfa3-4d4a-a0ef-60cbec525ab4',
            children: [],
          },
          {
            displayName: 'Dine lagrede søk',
            path: 'https://arbeidsplassen.nav.no/stillinger/lagrede-sok',
            isMyPageMenu: true,
            id: '7e06bac1-81d7-4f22-a1ae-1ba41502b802',
            children: [],
          },
          {
            displayName: 'Din aktivitetsplan',
            path: 'https://aktivitetsplan.nav.no',
            isMyPageMenu: true,
            id: 'df13e0c0-ab47-4bd8-9593-7a5dca7986d6',
            children: [],
          },
          {
            displayName: 'Dialog med veilederen din',
            path: 'http://nav.no/arbeid/dialog',
            isMyPageMenu: true,
            id: 'b2041cba-9580-499e-815b-caa624d49304',
            children: [],
          },
          {
            displayName: 'Ditt jobbspor',
            path: 'https://jobbsporet.nav.no/',
            flatten: false,
            isMyPageMenu: true,
            id: '563ff36c-cd2e-4bd3-9a9d-b314562774be',
            children: [],
          },
        ],
      },
      {
        displayName: 'Flere tjenester',
        path: '',
        isMyPageMenu: true,
        id: 'ecfbac87-4259-4402-8f64-6c65b2ed2dfd',
        children: [
          {
            displayName: 'Din pensjon',
            path: 'https://www.nav.no/pselv/publisering/dinpensjon.jsf?context=pensjon',
            isMyPageMenu: true,
            id: 'bfe43e1e-a074-4300-a480-618ac9b054f6',
            children: [],
          },
          {
            displayName: 'Din uføretrygd',
            path: 'https://www.nav.no/pselv/publisering/uforetrygd.jsf?context=ut',
            isMyPageMenu: true,
            id: '02f4c191-dee0-43e9-acff-c05d8b9aec10',
            children: [],
          },
          {
            displayName: 'Ditt sykefravær',
            path: 'https://www.nav.no/syk/sykefravaer',
            isMyPageMenu: true,
            id: 'd5c02d97-3041-4c72-9555-993efb7605b0',
            children: [],
          },
          {
            displayName: 'Dine foreldrepenger',
            path: 'https://foreldrepenger.nav.no',
            isMyPageMenu: true,
            id: '7c5a5ff5-c06e-4279-ab85-e9a87f9743c2',
            children: [],
          },
          {
            displayName: 'Dine fullmakter',
            path: 'https://www.nav.no/person/pdl-fullmakt-ui',
            isMyPageMenu: true,
            id: 'ff549cdc-c3ac-4056-8838-c3a01cf8b086',
            children: [],
          },
          {
            displayName: 'Dine pleiepenger',
            path: 'https://www.nav.no/familie/sykdom-i-familien/soknad/innsyn',
            isMyPageMenu: true,
            id: '1c79a492-9ba7-42af-b29d-c18a5dee2367',
            children: [],
          },
          {
            displayName: 'Dine hjelpemidler',
            path: 'https://www.nav.no/hjelpemidler/dinehjelpemidler/',
            isMyPageMenu: true,
            id: '172fae26-2e5c-4442-b9f5-fcb276fe9ad5',
            children: [],
          },
          {
            displayName: 'Økonomisk sosialhjelp',
            path: 'https://www.nav.no/sosialhjelp/innsyn/',
            isMyPageMenu: true,
            id: '97e23fef-f3d8-4861-a3d5-aac395477037',
            children: [],
          },
        ],
      },
    ],
    texts: {
      share_screen: 'Del skjerm med veileder',
      to_top: 'Til toppen',
      menu: 'Meny',
      close: 'Lukk',
      did_you_find: 'Fant du det du lette etter?',
      search: 'Søk',
      sok_knapp_sokefelt: 'Søk på nav.no',
      login: 'Logg inn',
      logout: 'Logg ut',
      notifications: 'Varsler',
      notifications_empty_list: 'Du har ingen nye varsler',
      notifications_empty_list_description: 'Vi varsler deg når noe skjer',
      notifications_show_all: 'Tidligere varsler',
      notifications_messages_title: 'Beskjeder',
      notified_EPOST: 'Varslet på e-post',
      notified_SMS: 'Varslet på SMS',
      earlier_notifications: 'Tidligere varsler',
      masked_message_text:
        'Du har fått en melding, logg inn med høyere sikkerhetsnivå for å se meldingen.',
      masked_task_text:
        'Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.',
      archive: 'Arkiver',
      notifications_tasks_title: 'Oppgaver',
      token_warning_title: 'Du blir snart logget ut automatisk',
      token_warning_body: 'Vil du fortsatt være innlogget?',
      session_warning_title: 'Du blir logget ut automatisk om ca $1 minutter',
      session_warning_body: 'Avslutt det du jobber med og logg inn igjen.',
      yes: 'Ja',
      no: 'Nei',
      ok: 'OK',
      hensikt_med_tilbakemelding:
        'Du får dessverre ikke svar på tilbakemeldingen din. Har du spørsmål eller trenger du hjelp?',
      hensikt_med_tilbakemelding_lenke: 'Ring, chat eller skriv til oss',
      send_undersokelse_takk: 'Takk!',
      rolle_privatperson: 'Privat',
      rolle_arbeidsgiver: 'Arbeidsgiver',
      rolle_samarbeidspartner: 'Samarbeidspartner',
      meny_bunnlenke_minside_stikkord:
        'Dine saker, utbetalinger, meldinger, meldekort, aktivitetsplan, personopplysninger og flere tjenester',
      meny_bunnlenke_arbeidsgiver_stikkord:
        'Dine sykmeldte, rekruttering, digitale skjemaer',
      meny_bunnlenke_samarbeidspartner_stikkord:
        'Helsepersonell, tiltaksarrangører, fylker og kommuner',
      loading_notifications: 'Laster varslinger',
      notifications_error: 'Feil ved lasting av varsler',
      til_forsiden: 'Til forsiden',
      how_can_we_help: 'Hva kan vi hjelpe deg med?',
    },
  },
};
