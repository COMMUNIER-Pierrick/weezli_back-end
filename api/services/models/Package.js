module.exports = class Package{
    constructor(addressDeparture, addressArrival, datetimeDeparture, datetimeArrival, kgAvailable, description, idTransport, sizes) {
        this.addressDeparture = addressDeparture;
        this.addressArrival = addressArrival;
        this.datetimeDeparture = datetimeDeparture;
        this.datetimeArrival = datetimeArrival;
        this.kgAvailable = kgAvailable;
        this.description = description;
        this.idTransport = idTransport;
        this.sizes = sizes;
    }
}

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
