## Requirements

### Description
One app with two "sides" --

#### Side A: a meals database, with each meal having:
    - ingredients*
    - a "hearts" rating
    - tags (e.g. 'indian' or 'veg')
    - comments
    - info/general description
    - url (if applicable)

#### Side B: a shopping list
the list is driven by the meals selected for the week (as the meals db grows this becomes very useful) as well as items added ad-hoc to it.
each "list" is a new instance, with the following features:

    - sorting
    - checking things "off" the list
    - CrUD

## Database Design
    Meals
        name
        tags[]
        info
        ratings[]
        comments[]
        url
        ref items[]

    Items
        name
        desc (optional)
        quantity (default: 1)

    Users
        name
        icon? (like netflixs method)

    Lists
        ref meals[]




