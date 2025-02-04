

const axios = require('axios');

const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');
const ServiceError = require('../utils/service-error');
const { AppError } = require('../utils');
const { StatusCodes } = require('http-status-codes');

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {

        try {
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${flightId}`;
            const flight = await axios.get(getFlightRequestURL);
            const flightData =  flight.data.data;
            let priceOfTheFlight = flightData.price;

            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError('something went wrong in the booking process:', 'Insufficient seats in the flight');
            }

            const totalCost = priceOfTheFlight * data.noOfSeats;

            const bookingPayload = {...data, totalCost};

            const booking = await this.bookingRepository.create(bookingPayload);
            
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flight/${booking.dataValues.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.dataValues.noOfSeats });

            const finalBooking = await this.bookingRepository.updateBooking(booking.dataValues.id,{status: "Booked"});
            return finalBooking;
            
        } catch (error) {
            if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }
    }

}

module.exports = BookingService;