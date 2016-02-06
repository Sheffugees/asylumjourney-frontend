(function() {
  'use strict';

  angular
    .module('asylumjourneyFrontend')
    .service('services', services);

  /** @ngInject */
  function services() {

    this.getServices = getServices;

    ///////////


    /*
    Use http://www.json-generator.com/ to create dummy data for dev
[
  '{{repeat(5, 7)}}',
  {
    _id: '{{objectId()}}',
    index: '{{index()}}',
	name: '{{lorem(2, "words")}}',
    description: '{{lorem(2, "sentences")}}',
    address: 'Electric Works, Sheffield Digital Campus, Sheffield',
    postcode: 'S1 2BJ',
    phone: '{{phone()}}',
    email: '{{email()}}',
    url: 'https://groups.google.com/forum/#!forum/sheffugees',
    named_contact: '{{firstName()}} {{surname()}}',
    maintainer: '{{firstName()}} {{surname()}}',
    start_date: '{{date()}}',
    end_date: '{{date()}}'
  }
]
*/

    function getServices() {
      var data = [
  {
    "_id": "56b620a8e477b788e889d1e3",
    "index": 0,
    "name": "fugiat aliqua",
    "description": "Irure mollit officia amet culpa sunt. Enim ullamco deserunt dolore consequat sunt esse.",
    "address": "Electric Works, Sheffield Digital Campus, Sheffield",
    "postcode": "S1 2BJ",
    "phone": "(927) 483-2516",
    "email": "kathrineobrien@tubesys.com",
    "url": "https://groups.google.com/forum/#!forum/sheffugees",
    "named_contact": "Sonya Cannon",
    "maintainer": "Dickerson Bowman",
    "start_date": "Thu May 04 2000 20:01:05 GMT+0100 (BST)",
    "end_date": "Sun Apr 03 2005 19:04:09 GMT+0100 (BST)"
  },
  {
    "_id": "56b620a8142de6df38c3dfc4",
    "index": 1,
    "name": "consequat id",
    "description": "Enim qui in tempor culpa labore sint do do. Dolor id qui cillum id reprehenderit.",
    "address": "Electric Works, Sheffield Digital Campus, Sheffield",
    "postcode": "S1 2BJ",
    "phone": "(935) 544-3348",
    "email": "dickersonbowman@tubesys.com",
    "url": "https://groups.google.com/forum/#!forum/sheffugees",
    "named_contact": "Glenda Hewitt",
    "maintainer": "Allison Miranda",
    "start_date": "Fri Dec 10 1976 03:24:13 GMT+0000 (GMT)",
    "end_date": "Sun Oct 16 2011 16:51:28 GMT+0100 (BST)"
  },
  {
    "_id": "56b620a8468c4cce4cd52133",
    "index": 2,
    "name": "occaecat minim",
    "description": "Adipisicing do laboris fugiat veniam velit ex sit do id aliquip. Magna ea adipisicing tempor officia pariatur dolor exercitation.",
    "address": "Electric Works, Sheffield Digital Campus, Sheffield",
    "postcode": "S1 2BJ",
    "phone": "(855) 443-3035",
    "email": "allisonmiranda@tubesys.com",
    "url": "https://groups.google.com/forum/#!forum/sheffugees",
    "named_contact": "Knight Coffey",
    "maintainer": "Juanita Simmons",
    "start_date": "Fri Oct 05 2012 01:22:13 GMT+0100 (BST)",
    "end_date": "Sun Nov 24 2002 02:21:25 GMT+0000 (GMT)"
  },
  {
    "_id": "56b620a84efa63cf9825d2d3",
    "index": 3,
    "name": "est consectetur",
    "description": "Mollit enim adipisicing sunt laborum laboris cillum commodo aute esse ea tempor id. Duis dolor aliquip occaecat consectetur labore esse ut.",
    "address": "Electric Works, Sheffield Digital Campus, Sheffield",
    "postcode": "S1 2BJ",
    "phone": "(979) 439-2162",
    "email": "juanitasimmons@tubesys.com",
    "url": "https://groups.google.com/forum/#!forum/sheffugees",
    "named_contact": "Tessa Lyons",
    "maintainer": "Vance Hodge",
    "start_date": "Wed May 11 1994 08:02:43 GMT+0100 (BST)",
    "end_date": "Tue Aug 25 1981 09:36:18 GMT+0100 (BST)"
  },
  {
    "_id": "56b620a8169ef65296893b1a",
    "index": 4,
    "name": "exercitation cillum",
    "description": "Exercitation reprehenderit nulla qui veniam sunt et enim amet nulla labore Lorem in do consequat. Officia eu deserunt dolore pariatur eu elit elit proident.",
    "address": "Electric Works, Sheffield Digital Campus, Sheffield",
    "postcode": "S1 2BJ",
    "phone": "(801) 436-2281",
    "email": "vancehodge@tubesys.com",
    "url": "https://groups.google.com/forum/#!forum/sheffugees",
    "named_contact": "Audra Olsen",
    "maintainer": "Cooley Golden",
    "start_date": "Mon Mar 28 1977 07:14:42 GMT+0100 (BST)",
    "end_date": "Sun Nov 11 2001 19:19:11 GMT+0000 (GMT)"
  },
  {
    "_id": "56b620a844e8f2d3697f0a35",
    "index": 5,
    "name": "aliquip sunt",
    "description": "Elit fugiat anim esse consectetur nisi nostrud in est cupidatat consequat elit eiusmod et minim. Officia id do do sint proident dolor nisi tempor consequat pariatur voluptate.",
    "address": "Electric Works, Sheffield Digital Campus, Sheffield",
    "postcode": "S1 2BJ",
    "phone": "(833) 443-2196",
    "email": "cooleygolden@tubesys.com",
    "url": "https://groups.google.com/forum/#!forum/sheffugees",
    "named_contact": "Carolyn Puckett",
    "maintainer": "Belinda Robbins",
    "start_date": "Mon Dec 03 1990 01:30:25 GMT+0000 (GMT)",
    "end_date": "Thu Oct 01 1970 15:20:24 GMT+0000 (BST)"
  },
  {
    "_id": "56b620a80f6b77b45a8c4e17",
    "index": 6,
    "name": "esse occaecat",
    "description": "Commodo cillum aute in quis. Quis ea consequat laboris cupidatat et aliquip irure.",
    "address": "Electric Works, Sheffield Digital Campus, Sheffield",
    "postcode": "S1 2BJ",
    "phone": "(929) 521-2867",
    "email": "belindarobbins@tubesys.com",
    "url": "https://groups.google.com/forum/#!forum/sheffugees",
    "named_contact": "Salas Barrera",
    "maintainer": "Rebecca Chandler",
    "start_date": "Wed May 27 2009 14:58:51 GMT+0100 (BST)",
    "end_date": "Thu May 17 1984 21:23:35 GMT+0100 (BST)"
  }
];

      return data;
    }
  }

})();
