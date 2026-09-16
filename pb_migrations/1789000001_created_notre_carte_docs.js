/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "type": "base",
    "name": "notre_carte_docs",
    // Seul un compte de la collection dédiée carte_users peut lire/écrire —
    // jamais la collection publique "users" (auto-inscription ouverte).
    "listRule": "@request.auth.collectionName = 'carte_users'",
    "viewRule": "@request.auth.collectionName = 'carte_users'",
    "createRule": null,
    "updateRule": "@request.auth.collectionName = 'carte_users'",
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
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
        "hidden": false,
        "id": "json_doc",
        "maxSize": 0,
        "name": "doc",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ]
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("notre_carte_docs");
  return app.delete(collection);
});
