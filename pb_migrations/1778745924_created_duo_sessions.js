/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1997877400",
        "max": 0,
        "min": 0,
        "name": "code",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation1159460247",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "initiator",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation824917526",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "partner",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json522110597",
        "maxSize": 0,
        "name": "initiator_profile",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json1186842898",
        "maxSize": 0,
        "name": "partner_profile",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1136262716",
        "max": 0,
        "min": 0,
        "name": "step",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "date261981154",
        "max": "",
        "min": "",
        "name": "expires_at",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "date"
      }
    ],
    "id": "pbc_4197038223",
    "indexes": [],
    "listRule": "@request.auth.id = initiator.id || @request.auth.id = partner.id",
    "name": "duo_sessions",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = initiator.id || @request.auth.id = partner.id",
    "viewRule": "@request.auth.id = initiator.id || @request.auth.id = partner.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4197038223");

  return app.delete(collection);
})
