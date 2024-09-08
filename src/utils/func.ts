import $ from 'jquery'

export const closeMenu = () => {
    $(".dropdown").removeClass("dropdown-open");
    const active = document.activeElement as HTMLElement;
    active.blur();
};