import { templates } from '../settings.js';

class Home{
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
  }

  render(element){
    const thisHome = this;

    const generatedHTML = templates.homeWidget();
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    element.innerHTML = generatedHTML;
  }
}

export default Home;
