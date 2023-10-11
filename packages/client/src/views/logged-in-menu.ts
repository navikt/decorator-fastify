import cls from 'decorator-shared/views/header/navbar-items/logged-in-menu.module.css';

// Fetch notifications and such
export function initLoggedInMenu() {
  const profileButton = document.getElementById('profile-button');
  const dropdownIds = ['my-page-menu-content', 'notifications-menu-content'];

  // @TODO: needs some minor polishing to get switching between menus to work
  const toggleContainer = () => {
    document
      .getElementById(`loggedin-menu-wrapper`)
      ?.classList.toggle(cls.active);
    document.getElementById(`menu-background`)?.classList.toggle(cls.active);
  };

  const hideDropdowns = () => {
    dropdownIds.forEach((id) => {
      document.getElementById(id)?.classList.remove(cls.active);
    });
  };

  profileButton?.addEventListener('click', () => {
    profileButton.classList.toggle('active');
    toggleContainer();
    hideDropdowns();

    document
      .getElementById('my-page-menu-content')
      ?.classList.toggle(cls.active);
  });

  const notificationsButton = document.getElementById('notifications-button');

  notificationsButton?.addEventListener('click', () => {
    toggleContainer();
    hideDropdowns();

    document
      .getElementById('notifications-menu-content')
      ?.classList.toggle(cls.active);
  });
}
