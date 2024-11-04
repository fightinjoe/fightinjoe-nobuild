class MainPage {
  /** Internal state for tracking selected nav DOM elts */
  _nav1
  _nav2

  /** Internal state for tracking DOM elements */
  contentElt
  navElt

  constructor() {
    // register content container

    // register navigation
    this.navElt = document.querySelector('nav')

    // add event listeners
    let navItems = this.navElt.querySelectorAll('li')
    navItems.forEach((item) => {
      item.addEventListener('click', this.handleNavClick.bind(this))
    })
  }

  get nav1() { return this._nav1 }
  set nav1( elt ) {
    // Only operate on nav items at data-level 1
    if (elt.dataset.level !== '1') return

    // Ignore if the same nav is clicked
    if (elt === this._nav1) return

    // unselect the child nav
    this.nav2 = null

    // Deselect the current nav and select the new one
    if (this._nav1) this._nav1.classList.remove('sel')
    elt.classList.add('sel')
    this._nav1 = elt
  }

  get nav2() { return this._nav2 }
  set nav2( elt ) {
    // Deselection
    if (elt === null || elt === this._nav2) {
      if (this._nav2) this._nav2.classList.remove('sel')
      this._nav2 = null
      return
    }

    if (this._nav2) this._nav2.classList.remove('sel')
    elt.classList.add('sel')

    this._nav2 = elt
  }

  handleNavClick(e) {
    // Prevent the clicking of a sub-nav from bubbling up to the parent nav
    e.stopPropagation()

    let newNav = e.target

    if (newNav.dataset.level === '1') this.nav1 = newNav
    if (newNav.dataset.level === '2') this.nav2 = newNav
  }

}