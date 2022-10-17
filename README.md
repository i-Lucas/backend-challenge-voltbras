# backend-challenge

O ano é 2118, 100 anos após a fundação da [Voltbras]. Expandimos nosso negócios para gerenciamento de carregamento de veículos espaciais não tripulados com propulsão de íons.
O Propulsor de Íons é um dos diversos tipos de propulsão espacial, que utiliza feixes de luz à base de energia elétrica (aí onde entra a Voltbras, iremos fornecer esta energia).

Especificamente, esta propulsão de energia deve ser provinda de combustível nuclear, pois a força de impulsão é muito forte.
Se a inserção do combustível for realizada num planeta de baixa gravidade, acontece a fissão do combustível nuclear e perde-se bastante potencial energético.
Por isso precisamos realizar o abastecimento das naves em planetas com alta gravidade, nos quais chega a ser 100 vezes mais eficiente o abastecimento.

**O seu trabalho é** descobrir em quais planetas a Voltbras pode instalar seus novos postos de carregamento e otimizar a experiência de recarga para os viajantes espaciais.

Para isso:

- utilize a API de exoplanetas da [NASA], na qual você pode consultar sua [documentação](https://exoplanetarchive.ipac.caltech.edu/docs/program_interfaces.html) e [queries comuns](https://exoplanetarchive.ipac.caltech.edu/docs/API_queries.html), o que te possibilita buscar os planetas fora do sistema solar!
- só mostre os planetas com gravidade alta, os dados não mostram exatamente qual gravidade o planeta tem, mas a Voltbras fez os cálculos e os planetas ideais(com gravidade alta), são aproximadamente os mesmos que têm sua massa maior que 10 jupiter mass (`exoplanet.pl_bmassj`)

## Requisitos

Sinta-se livre para fazer qualquer um dos próximos requisitos diferente do que foi pedido desde que consiga justificar a mudança. Ex.: não fiz o requisito de tal maneira pois a implementação que eu fiz é mais performática e segura.

- [ ] Crie um servidor em Node.js usando [Apollo GraphQL Server](https://www.apollographql.com/docs/apollo-server/)
  - [ ] Crie o schema GraphQL com uma query `suitablePlanets`, que retorna os dados dos planetas com gravidade alta
  - [ ] Crie uma mutation `installStation`, que dado um planeta, instala uma estação de carregamento no planeta(é sugerido criar uma tabela em algum DB que guarde a informação de aonde estão instaladas as estações)
  - [ ] Crie uma query `stations`, que irá listar todas as estações instaladas nos planetas
  - [ ] Crie uma mutation `recharge`, que dado uma estação e um datetime de quanto a recarga irá finalizar, realiza uma recarga, começando a partir do momento em que a mutation foi chamada e finalizando com a datetime passada.
    - Só é possível realizar uma recarga na estação por vez
    - Essa recarga deve estar atrelado a um usuário - sinta-se livre para implementar da maneira que você desejar.
    - Um usuário só pode ter no máximo uma recarga em andamento
- [ ] Documente o seu projeto, e explique como rodar ele
- [ ] Crie o projeto em algum repositório privado no GitHub ou GitLab

# Extras

- [ ] Adicione testes usando [Jest] ou qualquer outro framework para testes
- [ ] Usar Typescript
- [ ] Coloque um docker-compose, que simplifique rodar o seu servidor e o DB
- [ ] Usamos [prisma](prisma.io) mas sinta-se livre para usar qualquer ORM
- [ ] Adicione autenticação (apenas um usuário autenticado poderá fazer uma recarga ou uma reserva)
- [ ] Crie uma mutation `reservation`, que dado uma estação, um usuário e um intervalo de tempo, cria uma reserva da estação para o usuário naquele determinado intervalo de tempo.
  - Não deve ser possível criar uma reserva que conflite com o intervalo de outra reserva ou de uma recarga já em andamento
  - Para realizar uma recarga de uma determinada reserva, é necessário chamar uma mutation (podendo ser a própria `recharge` ou uma nova mutation - como você preferir) passando apenas um `reservationId`. A utilização só pode ocorrer dentro do próprio intervalo de tempo da reserva (e.g. Se a reserva foi de 12:00 até 13:00, só deve ser possível utilizá-la entre 12:00 e 13:00).
  - A recarga de uma reserva deve ser finalizada ao final do intervalo da reserva.
- [ ] Crie uma query `stationHistory`, onde será possível visualizar o histórico de recargas de uma estação (mostrar o horário, o tempo de duração da recarga e o usuário que realizou-a)

## Exemplo do dado da API da NASA

```json
[
  {
    "pl_hostname":"11 UMi",
    ...
    "pl_bmassj":14.74000,
    "pl_bmassjerr1":2.50000,
    "pl_bmassjerr2":-2.50000,
    "pl_bmassjlim":0,
    ...
  },
  ...
]
```

## Exemplo do dado da sua API

Dado uma query

```graphql
{
  suitablePlanets {
    name
    mass
    hasStation
  }
}
```

Retornar uma response

```json
{
    "suitablePlanets": [
        {
            "name": "XPTO",
            "mass": 27.5,
            "hasStation": false
        },
        {
            "name": "REPOLHO",
            "mass": 52.0,
            "hasStation": true
        },
        ...
    ]
}
```

## Exemplo das mutations

```graphql
{
  installStation(
    input: { name: "nome de exemplo", planet: "planeta de exemplo" }
  )
}
```

[nasa]: https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps&format=json
[jest]: https://jest-everywhere.now.sh/
[voltbras]: https://voltbras.com.br
[jupiter mass]: https://en.wikipedia.org/wiki/Jupiter_mass
