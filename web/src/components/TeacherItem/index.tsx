import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

function TeacherItem() {
  return (
    <article className="teacher-item">
      <header>
        <img src="https://avatars2.githubusercontent.com/u/3639433?s=400&u=7888fceb164408d0236897f405306cb7d46ae441&v=4" alt="Professor" />
        <div>
          <strong>Diego Fernandes</strong>
          <span>Química</span>
        </div>
        </header>
        <p>
          Entusiasta das melhores tecnologias de química avançada.
          <br /><br />
          Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências.
        </p>
        <footer>
          <p>
            Preço/hora
            <strong>R$ 80,00</strong>
          </p>
          <button type="button">
            <img src={whatsappIcon} alt="Whatsapp" />
            Entrar em contato
          </button>
        </footer>
      
    </article>
  )
}

export default TeacherItem;