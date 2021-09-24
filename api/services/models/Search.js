module.exports = class Search {
    constructor(departure, arrival, date, sizes, kgAvailable, transport, type) {
       this.departure = departure;
       this.arrival = arrival;
       this.date = date;
       this.sizes = sizes;
       this.kgAvailable = kgAvailable;
       this.transport = transport;
       this.type = type;
    }
}
