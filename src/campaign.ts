
export class Campaign {
    // class variables or whatever they were called
    readonly name: string
    private readonly id: number
    private readonly locations: Locations[] = []
    private readonly contacts:  Contact[] = []
    stalkers: Stalker[] = []
    coupons: number = 0

    // class constructor
    public constructor(name:string ,id: number, locations?: Locations[], contacts?: Contact[], stalkers?: Stalker[], coupons?: number){
        
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
        if(locations){
            this.locations = locations
        }
        if(contacts){
            this.contacts = contacts
        }
        if(stalkers){
            stalkers.forEach(stalker => {
                this.newStalker(stalker.name, stalker.player, stalker.equipment)
            });
        }
        if(coupons){
            this.coupons = coupons
        }
    }

    // creates a new stalker objects and pushes it into the campaign
    public newStalker(name: string, player: string, equipment?: Equipment[]){
        let stalk = new Stalker(name, player, equipment)
        this.stalkers.push(stalk)
    }

    // converts the contents of the campaign to json
    private toObject() {
        let locations: Object[] = []
        this.locations.forEach((locaton) => {
            //locations to object
        })
        let contacts: Object[] = []
        let stalkers: Object[] = []
        this.stalkers.forEach((stalker) => {
            stalkers.push(stalker.serialize())
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

    public serialize(){
        console.log('serializing')
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

class Stalker {
    readonly name: string
    readonly player: string
    readonly equipment: Equipment[] = []
    readonly achievements: Achievement[] = []

    public constructor(name: string, player: string, equipment?: Equipment[]){
        this.name = name
        this.player = player
        if(equipment){
            this.equipment = []
            if(equipment.length > 0){
                equipment.forEach((equip)=>{
                    this.addEquipment(equip.name, equip.type, equip.personal)
                })
            }
        }
    }

    private toObject() {
        let equipment: Object[] = []
        this.equipment.forEach((equip) => {
            equipment.push(equip)
        })

        return {
            name: this.name,
            player: this.player,
            equipment: equipment,
        }
    }

    public serialize(){
        console.log('serializing, stalker')
        return this.toObject()
    }

    addEquipment(name: string, type: string, personal: boolean){
        this.equipment.push(new Equipment(name, type, personal))
    }
}

// * i think im done with equipment
/**
 * @property {string} name equipment name
 * @property {string} type equipment type
 * @property {boolean} personal if equipment is personal or not
 * @property {string} personalStalker which stalker the personal equipment is bound to
 */
class Equipment {
    // the equipment properties
    readonly name: string
    readonly type: string
    readonly personal: boolean = false
    readonly personalStalker: string

    public constructor(name: string, type: string, personal?: boolean, personalStalker?: string){
        this.name = name
        this.type = type
        personal ? this.personal = true : this.personal = false
        personalStalker ? this.personalStalker = personalStalker : this.personalStalker = ''
    }

    private toObject(){
        if(this.personalStalker){
            return {
                name: this.name,
                type: this.type,
                personal: this.personal,
                personalStalker: this.personalStalker
            }
        }
        return {
            name: this.name,
            type: this.type,
            personal: this.personal
        }
    }

    public serialize(){
        console.log('serializing equipment')
        return this.toObject()
    }
}

class Achievement {
    private readonly title: string
    private readonly condition: string
    private readonly completed: boolean
    private readonly reward: string

    constructor(title: string, condition: string, reward: string, completed: boolean){
        this.title = title
        this.condition = condition
        this.reward = reward
        this.completed = completed
    }
}

class Locations {

}

class Contact {

}
// probably wont need these
class PersonalEquipment extends Equipment {
    public constructor(name: string, type: string, stalker: string){
        super(name, type)
    }
    
}

class NormalEquipment extends Equipment {
    public constructor(name: string, type: string){
        super(name, type)
    }
}
