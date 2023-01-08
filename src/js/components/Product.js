import {select, templates, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  renderInMenu(){
    const thisProduct = this;

    /* [DONE] generate HTML based on template */
    const generatedHTML = templates.menuProduct(thisProduct.data);
    /* [DONE] create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /* [DONE] find menu container */
    const menuContainer = document.querySelector(select.containerOf.menu);
    /* [DONE] add element to menu */
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.dom = {};

    thisProduct.dom.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.dom.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.dom.formInputs = thisProduct.dom.form.querySelectorAll(select.all.formInputs);
    thisProduct.dom.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.dom.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.dom.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.dom.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;

    /* [DONE] START: add event listener to clickable trigger on event click */
    thisProduct.dom.accordionTrigger.addEventListener('click', function(event) {
      /* [DONE] prevent default action for event */
      event.preventDefault();
      /* [DONE] find active product (product that has active class) */
      const activeProduct = document.querySelector(select.all.menuProductsActive);
      /* [DONE] if there is active product and it's not thisProduct.element, remove class active from it */
      if(activeProduct != null && activeProduct != thisProduct.element) {
        activeProduct.classList.remove('active');
      }
      /* [DONE] toggle active class on thisProduct.element */
      thisProduct.element.classList.toggle('active');
    });
  }

  initOrderForm(){
    const thisProduct = this;

    thisProduct.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.dom.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.dom.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;

    /* [DONE] covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']} */
    const formData = utils.serializeFormToObject(thisProduct.dom.form);

    /* [DONE] set price to default price */
    let price = thisProduct.data.price;

    /* [DONE] for every category (param)... */
    for(let paramId in thisProduct.data.params){
      /* [DONE] determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... } */
      const param = thisProduct.data.params[paramId];

      /* [DONE] for every option in this category */
      for(let optionId in param.options){
        /* [DONE] determine option value */
        const option = param.options[optionId];
        /* [DONE] determine optionSelect value */
        const optionSelect = formData[paramId] && formData[paramId].includes(optionId);
        /* [DONE] check if there is param with a name of paramId in formData and if it includes optionId (WITH optionSelect) */
        if(optionSelect){
          /* [DONE] check if the option is not default */
          if(!option.default){
            /* [DONE] add option price to price variable */
            price += option.price;
          }
        }
        /* [DONE] check if the option is default */
        else if (option.default){
          /* [DONE] reduce price variable */
          price -= option.price;
        }
        /* [DONE] find img witch '.paramId-optionId' class */
        const image = thisProduct.dom.imageWrapper.querySelector('.' + paramId + '-' + optionId);
        /* [DONE] check if img is founded */
        if(image){
          /* [DONE] check if option is selected & show or hide img */
          if(optionSelect){
            image.classList.add(classNames.menuProduct.imageVisible);
          } else {
            image.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    /* [DONE] define single price for a product */
    thisProduct.priceSingle = price;
    /* [DONE] multiply price by amount */
    price *= thisProduct.amountWidget.value;
    /* [DONE] update calculated price in the HTML */
    thisProduct.dom.priceElem.innerHTML = price;
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.dom.amountWidgetElem);

    thisProduct.dom.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }

  prepareCartProductParams(){
    const thisProduct = this;

    /* [DONE] covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']} */
    const formData = utils.serializeFormToObject(thisProduct.dom.form);

    const params = {};

    /* [DONE] for every category (param)... */
    for(let paramId in thisProduct.data.params){
      /* [DONE] determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... } */
      const param = thisProduct.data.params[paramId];
      /* [DONE] create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}  */
      params[paramId] = {
        label: param.label,
        options: {}
      };

      /* [DONE] for every option in this category */
      for(let optionId in param.options){
        /* [DONE] determine option value */
        const option = param.options[optionId];
        /* [DONE] determine optionSelect value */
        const optionSelect = formData[paramId] && formData[paramId].includes(optionId);
        /* [DONE] check if there is param with a name of paramId in formData and if it includes optionId (WITH optionSelect) */
        if(optionSelect){
          /* [DONE] option is selected! */
          params[paramId].options[optionId] = option.label;
        }
      }
    }

    return params;
  }

  prepareCartProduct(){
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceSingle * thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams(),
    };
    return productSummary;
  }

  addToCart(){
    const thisProduct = this;

    // app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct(),
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
