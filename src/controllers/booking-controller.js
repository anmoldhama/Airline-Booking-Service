const {StatusCodes} = require('http-status-codes');

const {BookingService} = require('../services/index');
const {Success} = require('../utils/common/index');

const bookingService = new BookingService();

const create = async (req,res)=>{
    try{
    const response = await bookingService.createBooking(req.body);
    Success.message = 'Successfully created a booking';
    Success.data = response;
    return res.status(StatusCodes.OK).json(Success);
    }catch(error){
        return res.status(error.statusCodes).json({
            message: error.message,
            success: false,
            err: error.explanation,
            data: {}
        })
    }
}



module.exports = {
    create
}