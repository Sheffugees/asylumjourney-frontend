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
    id: '{{index(1)}}',
    name: 'Service {{index(1)}}',
    provider: '{{lorem(2, "words")}}',
    stage: 2,
    description: '{{lorem(2, "sentences")}}',
    address: '{{street()}}, Sheffield',
    postcode: 'S1 2BJ',
    phone: '{{phone()}}',
    email: '{{email()}}',
    url: 'https://groups.google.com/forum/#!forum/sheffugees',
    contact: '{{firstName()}} {{surname()}}',
    maintainer: '{{firstName()}} {{surname()}}',
    launch: '{{date()}}',
    expiry: '{{date()}}'
  }
]
*/

    function getServices() {
        var data = [
            {
            "id": 1,
            "name": "Dispersal to Sheffield (G4S)",
            "provider": "veniam elit",
            "stage": 1,
            "category": 3,
            "description": "Ullamco duis sint reprehenderit culpa anim ad reprehenderit tempor sit id reprehenderit consectetur tempor. Dolor cupidatat ad deserunt ad ipsum ut cupidatat quis.",
            "address": "Clinton Avenue, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(842) 423-3726",
            "email": "robinsoncleveland@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "Barrett Huber",
            "maintainer": "Karin Lowe",
            "launch": "Tue Sep 29 1981 16:59:13 GMT+0100 (BST)",
            "expiry": "Sat Apr 02 2011 08:19:15 GMT+0100 (BST)"
            },
            {
            "id": 2,
            "name": "Service 2 ed",
            "provider": "proident deserunt",
            "stage": 1,
            "category": 1,
            "description": "Ullamco deserunt sit culpa fugiat minim et deserunt do voluptate. Aliqua ex mollit quis enim ipsum occaecat.",
            "address": "Bedell Lane, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(892) 412-3898",
            "email": "karinlowe@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "Chandler Evans",
            "maintainer": "Estella Nielsen",
            "launch": "Sun Mar 28 1971 04:37:24 GMT+0000 (BST)",
            "expiry": "Sun Jan 09 1977 01:51:05 GMT+0000 (GMT)"
            },
            {
            "id": 3,
            "name": "Service 3 ed",
            "provider": "ut labore",
            "stage": 3,
            "category": 1,
            "description": "Eu nisi exercitation deserunt magna anim fugiat commodo anim pariatur anim aliqua adipisicing. Qui magna exercitation do eu.",
            "address": "Classon Avenue, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(827) 525-2179",
            "email": "estellanielsen@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "Nguyen Chan",
            "maintainer": "Susanne Barry",
            "launch": "Sat Jul 24 1993 08:41:52 GMT+0100 (BST)",
            "expiry": "Sun Nov 09 1997 20:59:52 GMT+0000 (GMT)"
            },
            {
            "id": 4,
            "name": "Service 4 health",
            "provider": "eu consequat",
            "stage": 4,
            "category": 2,
            "description": "Quis duis ea ex velit culpa fugiat labore magna quis ex consectetur proident id labore. Ipsum sunt quis ipsum cupidatat tempor culpa laboris minim consectetur anim non consectetur ea Lorem.",
            "address": "India Street, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(961) 423-3141",
            "email": "susannebarry@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "Crystal Barton",
            "maintainer": "Martina Stewart",
            "launch": "Thu Jun 18 1992 22:33:37 GMT+0100 (BST)",
            "expiry": "Mon Jul 01 2002 07:35:01 GMT+0100 (BST)"
            },
            {
            "id": 5,
            "name": "Service 5 housing",
            "provider": "aliqua amet",
            "stage": 2,
            "category": 3,
            "description": "Commodo nulla id proident enim pariatur ad proident veniam laborum dolore sit amet deserunt velit. Veniam nisi voluptate ullamco excepteur ipsum anim Lorem reprehenderit est voluptate sit ea occaecat incididunt.",
            "address": "Bogart Street, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(941) 479-2715",
            "email": "martinastewart@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "May Leach",
            "maintainer": "Silvia Farrell",
            "launch": "Mon Jun 01 1970 00:20:29 GMT+0000 (BST)",
            "expiry": "Sat May 04 2002 06:22:38 GMT+0100 (BST)"
            },
            {
            "id": 6,
            "name": "Service 6 housing",
            "provider": "sit culpa",
            "stage": 2,
            "category": 3,
            "description": "Anim enim anim proident duis ea. Ipsum velit velit in pariatur veniam ea reprehenderit sint non id do.",
            "address": "Fanchon Place, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(978) 523-2823",
            "email": "silviafarrell@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "Reese Hays",
            "maintainer": "Doyle Hall",
            "launch": "Thu Aug 19 1971 05:20:45 GMT+0000 (BST)",
            "expiry": "Tue Aug 19 1986 10:09:53 GMT+0100 (BST)"
            },
            {
            "id": 7,
            "name": "Service 7 ed",
            "provider": "aute irure",
            "stage": 4,
            "category": 1,
            "description": "Labore deserunt reprehenderit laboris pariatur ex adipisicing cillum ad laboris. Ad id eu in aliqua ea qui laboris deserunt magna.",
            "address": "Allen Avenue, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(991) 537-3599",
            "email": "doylehall@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "Francis Espinoza",
            "maintainer": "Janis Henry",
            "launch": "Thu Mar 12 1987 08:15:55 GMT+0000 (GMT)",
            "expiry": "Sun Dec 31 1995 13:50:33 GMT+0000 (GMT)"
            },
            {
            "id": 7,
            "name": "Service 7 ed",
            "provider": "aute irure",
            "stage": 2,
            "category": 1,
            "description": "Labore deserunt reprehenderit laboris pariatur ex adipisicing cillum ad laboris. Ad id eu in aliqua ea qui laboris deserunt magna.",
            "address": "Allen Avenue, Sheffield",
            "postcode": "S1 2BJ",
            "phone": "(991) 537-3599",
            "email": "doylehall@entropix.com",
            "url": "https://groups.google.com/forum/#!forum/sheffugees",
            "contact": "Francis Espinoza",
            "maintainer": "Janis Henry",
            "launch": "Thu Mar 12 1987 08:15:55 GMT+0000 (GMT)",
            "expiry": "Sun Dec 31 1995 13:50:33 GMT+0000 (GMT)"
            }
        ];

        return data;
        }
    }

})();
