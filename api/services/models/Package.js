module.exports = class Package{
    constructor(id, addressDeparture, addressArrival, datetimeDeparture, datetimeArrival, kgAvailable, description, idTransport, sizes) {
        this.id = id;
        this.addressDeparture = addressDeparture;
        this.addressArrival = addressArrival;
        this.datetimeDeparture = datetimeDeparture;
        this.datetimeArrival = datetimeArrival;
        this.kgAvailable = kgAvailable;
        this.description = description;
        this.idTransport = idTransport;
        this.sizes = sizes;
    }

    static PackageInsert(addressDeparture, addressArrival, datetimeDeparture, datetimeArrival, kgAvailable, description, idTransport, sizes){
        return new Package(null, addressDeparture, addressArrival, datetimeDeparture, datetimeArrival, kgAvailable, description, idTransport, sizes)
    }
}
/*
module.exports = class PackageId{
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
}
*/
