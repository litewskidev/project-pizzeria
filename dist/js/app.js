import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';

const app = {
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* [DONE] get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* [DONE] run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* [DONE] change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    /* [DONE] add class 'active' to matching pages, remove from non-matching */
    for(let page of thisApp.pages){
    //  if(page.id == pageId){
    //    page.classList.add(classNames.pages.active);
    //  } else {
    //    page.classList.remove(classNames.pages.active);
    //  }
      page.classList.toggle(
        classNames.pages.active,
        page.id == pageId
      );
    }

    /* [DONE] add class 'active' to matching links, remove from non-matching */
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function(){
    const thisApp = this;

    for(let productData in thisApp.data.products){
      new Product(
        thisApp.data.products[productData].id,
        thisApp.data.products[productData]
      );
    }
  },

  initData: function(){
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.products;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        /* [DONE] save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* [DONE] execute initMenu method */
        thisApp.initMenu();
      });
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function(){
    const thisApp = this;
    const bookingContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(bookingContainer);
  },

  initHome: function(){
    const thisApp = this;

    const homeContainer = document.querySelector(select.containerOf.home);
    thisApp.home = new Home(homeContainer);

    thisApp.pageLinks = document.querySelectorAll(select.home.pageLinks);

    for (let pageLink of thisApp.pageLinks){
      pageLink.addEventListener('click', function(event){
        event.preventDefault();

        const clickedElement = this;
        const pageLinkId = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(pageLinkId);
        window.location.hash = '#/' + pageLinkId;
      });
    }
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initHome();
  },
};

app.init();
