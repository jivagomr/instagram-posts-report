const Nightmare = require('nightmare');
const fs = require('fs');

var nightmare = Nightmare({show: false});

var delay_visit = 1500;

var main_crawler = async function * () {
  
  yield nightmare.goto('https://www.instagram.com/accounts/login/?source=auth_switcher')
        .wait('button[type="submit"]')
        .type('input[name="username"]','') //seu login
        .type('input[name="password"]','') //sua senha, caso necessário para uma conta privada que você segue
        .wait(650)
        .click('button[type="submit"]')  
        .wait(3000)
        .goto('https://www.instagram.com/jivagomr/') //link da conta que você quer gerar o relatório
        .wait(3000);

  var previousHeight, currentHeight=0;
  
  var links = new Array();

  while ((previousHeight !== currentHeight)) {
   
    previousHeight = currentHeight;
    
    var grabbed = await nightmare.evaluate(function() {
      var arr_href = Array.from(document.querySelectorAll("div.v1Nh3 a")).map(a => a.href); //caso a estrutura do HTML e nomes de classes mudem, o script precisa ser atualizado
      return [document.body.scrollHeight, arr_href];
    });

    var currentHeight = grabbed[0];

    grabbed[1].forEach(e => { links.push(e) });
    
    yield nightmare.scrollTo(currentHeight, 0).wait(3000);
  }

  yield nightmare.evaluate(() => document).then(
      (retorno) => { 
        return retorno;
      }
    );

  const uniq_links = Array.from(new Set(links));

  var arr_dates = new Array();

  var n = 0;
 
  var line = "";

  while (n < uniq_links.length) {
    var link_post = uniq_links[n];
    var visiting = await nightmare.goto(link_post).wait(delay_visit).evaluate((link) => {
      var date_time = document.querySelector("time._1o9PC").getAttribute("datetime"); //caso a estrutura do HTML e nomes de classes mudem, o script precisa ser atualizado
      var likes = document.querySelector("button.sqdOP > span").textContent; //caso a estrutura do HTML e nomes de classes mudem, o script precisa ser atualizado
      line = link+"\t"+date_time+"\t"+likes+"\r\n";
      return line;
    }, link_post).then((result) => arr_dates.push(result));    
    n++;
  }

  arr_dates.forEach(el => {
    fs.writeFileSync('report.csv', el, {flag: 'a+'});
  });

  yield nightmare.end();
};

// funcao anonima asincrona imediatamente invocada no lugar do vo
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/for-await...of
(async () => {
  for await(const el of main_crawler()) {
    // salvar / manipular os el
  }
})();