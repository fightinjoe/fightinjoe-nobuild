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

    const nulling = elt === this._nav1

    // Deselect the current nav and children
    if (this._nav1) this._nav1.classList.remove('sel')
    this.nav2 = null

    // Select the new nav item
    this._nav1 = nulling ? null : elt
    if (!nulling) this._nav1.classList.add('sel')
    
    // Update the level in the nav element
    this.navElt.dataset.level = nulling ? '0' : '1'
  }

  get nav2() { return this._nav2 }
  set nav2( elt ) {
    const nulling = elt === null || elt === this._nav2

    // remove any currently selected nav item
    if (this._nav2) this._nav2.classList.remove('sel')
    
    // select the new nav item
    this._nav2 = nulling ? null : elt
    if (!nulling) elt.classList.add('sel')

    this._nav2 = nulling ? null : elt
    
    // Update the level in the nav element
    this.navElt.dataset.level = nulling ? '1' : '2'
  }

  handleNavClick(e) {
    // Prevent the clicking of a sub-nav from bubbling up to the parent nav
    e.stopPropagation()

    let newNav = e.target

    if (newNav.dataset.level === '1') this.nav1 = newNav
    if (newNav.dataset.level === '2') this.nav2 = newNav
  }

}