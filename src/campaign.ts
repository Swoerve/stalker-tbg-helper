export class Campaign {
  // class variables or whatever they were called
  readonly name: string
  readonly id: string
  locations: Locations[] = []
  contacts: Contact[] = []
  stalkers: Stalker[] = []
  coupons: number = 0

  // class constructor
  public constructor(name: string, id: string, locations?: Locations[], contacts?: Contact[], stalkers?: Stalker[], coupons?: number) {

    this.locations = []
    this.contacts = []
    this.stalkers = []
    // contacts.forEach(contact => {
    //     this.contacts.push(new Contact(contact.name))
    // });

    //this.stalkers = stalkers
    this.coupons = 0
    this.name = name
    this.id = id
    if (locations) {
      this.locations = locations
    }
    if (contacts) {
      contacts.forEach(contact => {
        this.newContact(contact.name, contact.id, contact.card, contact.type)
      });
    }
    if (stalkers) {
      stalkers.forEach(stalker => {
        this.newStalker(stalker.name, stalker.player, stalker.id, stalker.equipment, stalker.achievements)
      });
    }
    if (coupons) {
      this.coupons = coupons
    }
  }

  // creates a new stalker objects and pushes it into the campaign
  public newStalker(name: string, player: string, id: string, equipment?: Equipment[], achievements?: Achievement[]) {
    let stalk = new Stalker(name, player, id, equipment, achievements)
    this.stalkers.push(stalk)
  }

  // creates a new contact objects and pushes it into the campaign
  public newContact(name: string, id: string, card: string, type: string) {
    let cont = new Contact(name, id, card, type)
    this.contacts.push(cont)
  }

  // converts the contents of the campaign to json
  private toObject() {
    let locations: Object[] = []
    this.locations.forEach((location) => {
      console.log('getting locations')
      //locations to object
    })
    let contacts: Object[] = []
    this.contacts.forEach((contact) => {
      console.log('getting stalkers')
      contacts.push(contact.serialize())
      //contacts to object
    })
    let stalkers: Object[] = []
    this.stalkers.forEach((stalker) => {
      console.log('getting stalkers')
      stalkers.push(stalker.serialize())
      //stalkers to object
    })

    let coupons: number = this.coupons

    return {
      name: this.name,
      id: this.id,
      locations: locations,
      contacts: contacts,
      stalkers: stalkers,
      coupons: coupons
    }
  }

  public serialize() {
    console.log('serializing')
    //console.log(this.toObject())
    return JSON.stringify(this.toObject())
  }

  // from a serialized json object parse it and convert back into a campaign object
  static fromSerialized(serialized: string) {
    const campaign: ReturnType<Campaign['toObject']> = JSON.parse(serialized)

    return new Campaign(
      campaign.name,
      campaign.id,
      campaign.locations as Locations[],
      campaign.contacts as Contact[],
      campaign.stalkers as Stalker[],
      campaign.coupons
    )
  }
}

export class Stalker {
  readonly name: string
  readonly player: string
  readonly id: string
  equipment: Equipment[] = []
  achievements: Achievement[] = []

  public constructor(name: string, player: string, id: string, equipment?: Equipment[], achievements?: Achievement[]) {
    this.name = name
    this.player = player
    this.id = id
    this.equipment = []
    this.achievements = []
    if (equipment) {
      equipment.forEach((equip) => {
        this.addEquipment(equip.name, equip.type, equip.id, equip.personal, equip.personalStalker)
      })
    }
    if (achievements) {
      achievements.forEach((achievement) => {
        this.addAchievement(achievement.title, achievement.condition, achievement.id, achievement.reward, achievement.completed)
      })
    }
  }

  private toObject() {

    let equipment: Object[] = []
    this.equipment.forEach((thing) => {
      console.log('getting equipment')

      equipment.push(thing.serialize())
    })

    let achievements: Object[] = []
    this.achievements.forEach((achievement) => {
      achievements.push(achievement.serialize())
    })

    return {
      name: this.name,
      player: this.player,
      id: this.id,
      equipment: equipment,
      achievements: achievements
    }
  }

  public serialize() {
    console.log('serializing, stalker')
    //console.log(this.toObject())
    return this.toObject()
  }

  addEquipment(name: string, type: string, id: string, personal: boolean, personalStalker: string) {
    this.equipment.push(new Equipment(name, type, id, personal, personalStalker))
  }

  addAchievement(title: string, condition: string, id: string, reward: string, completed: boolean) {
    this.achievements.push(new Achievement(title, condition, id, reward, completed))
  }
}

// * i think im done with equipment
/**
 * @property {string} name equipment name
 * @property {string} type equipment type
 * @property {boolean} personal if equipment is personal or not
 * @property {string} personalStalker which stalker the personal equipment is bound to
 */
export class Equipment {
  // the equipment properties
  readonly name: string
  readonly type: string
  readonly id: string
  readonly personal: boolean = false
  readonly personalStalker: string

  public constructor(name: string, type: string, id: string, personal?: boolean, personalStalker?: string) {
    this.name = name
    this.type = type
    this.id = id
    this.personal = false
    this.personalStalker = ''
    if (personal) {
      this.personal = personal
    }
    if (personalStalker) {
      this.personalStalker = personalStalker
    }
  }

  private toObject() {
    return {
      name: this.name,
      type: this.type,
      id: this.id,
      personal: this.personal,
      personalStalker: this.personalStalker
    }
  }

  public serialize() {
    console.log('serializing equipment')
    //console.log(this.toObject())
    return this.toObject()
  }
}

class Achievement {
  readonly title: string
  readonly condition: string
  readonly id: string
  readonly completed: boolean
  readonly reward: string

  constructor(title: string, condition: string, id: string, reward: string, completed: boolean) {
    this.title = title
    this.condition = condition
    this.id = id
    this.reward = reward
    this.completed = completed
  }

  private toObject() {
    return {
      title: this.title,
      condition: this.condition,
      id: this.id,
      completed: this.completed,
      reward: this.reward
    }
  }

  public serialize() {
    console.log('serializing Achievement')
    //console.log(this.toObject())
    return this.toObject()
  }
}

class Locations {

}

class Contact {
  readonly name: string
  readonly id: string
  readonly card: string
  readonly type: string
  // maybe story?
  //readonly story: string

  public constructor(name: string, id: string, card: string, type: string) {
    this.name = name
    this.id = id
    this.card = card
    this.type = type
  }

  private toObject() {
    return {
      name: this.name,
      id: this.id,
      card: this.card,
      type: this.type
    }
  }

  public serialize() {
    console.log('serializing Contact')
    //console.log(this.toObject())
    return this.toObject()
  }
}

function randomId(length: number) {
  return Math.random().toString(36).substring(2, length + 2);
}

function getIdFromObjects(objects: any[]) {
  let ids: string[] = []
  objects.forEach((element: any) => {
    ids.push(element.id)
  });
  return ids
}

export function generateId(array: any[]) {
  let ids = getIdFromObjects(array)
  const limit: number = 100
  let attempts = 0
  let id = false
  let returnId = ''
  while (!id && attempts < limit) {
    returnId = randomId(10)
    id = true
    if (!checkId(returnId, ids)) {
      id = false
      attempts++
    }
  }
  return returnId
}

function checkId(id: string, array: any[]) {
  let match = array.find((item) => {
    return item === id
  })
  return match ? false : true
}
