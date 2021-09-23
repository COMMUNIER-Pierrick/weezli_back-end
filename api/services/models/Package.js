module.exports = class Package{
    constructor(id, addressDeparture, addressArrival, datetimeDeparture, datetimeArrival, kgAvailable, description, transport, sizes) {
        this.id = id;
        this.addressDeparture = addressDeparture;
        this.addressArrival = addressArrival;
        this.datetimeDeparture = datetimeDeparture;
        this.datetimeArrival = datetimeArrival;
        this.kgAvailable = kgAvailable;
        this.description = description;
        this.transport = transport;
        this.sizes = sizes;
    }

    static PackageInsert(addressDeparture, addressArrival, datetimeDeparture, datetimeArrival, kgAvailable, description, transport, sizes){
        return new Package(null, addressDeparture, addressArrival, datetimeDeparture, datetimeArrival, kgAvailable, description, transport, sizes)
    }
}
