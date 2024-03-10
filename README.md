# Vehicle Bookin

cmd :

cd backend
npm i
run cmd: pm2 start 

APIS:

1.vehicle seed:

http://localhost:1234/vehicle-seed --GET

sample response

{
    "status": true,
    "message": "Vehicle data Seeded Succesfully!"
}

2.get active type of wheels

http://localhost:1234/active-wheels --GET

{
    "status": true,
    "message": "Success",
    "data": [
        2,
        4
    ]
}

3.get active type of vehicles based on wheel types

http://localhost:1234/active-vehicle-types/{enter the wheel type}
http://localhost:1234/active-vehicle-types/2 --GET


{
    "status": true,
    "message": "Success",
    "data": [
        "cruiser",
        "sports"
    ]
}

4.get active models based on type of vehicles

http://localhost:1234/active-vehicle-types/{enter the vechicle type}
http://localhost:1234/active-models/cruiser --GET


{
    "status": true,
    "message": "Success",
    "data": [
        {
            "_id": "65edfe17cc63536f5e3d1343",
            "model": "Harley-Davidson X440"
        },
        {
            "_id": "65edfe17cc63536f5e3d1344",
            "model": "Indian Scout"
        },
        {
            "_id": "65edfe17cc63536f5e3d1345",
            "model": "Yamaha Bolt"
        }
    ]
}


5.Book Vehicles

http://localhost:1234/book-vehicle --POST

{
    "firstName": "Umar",
    "lastName": "Farook",
    "vehicleID": "65edfe17cc63536f5e3d1343", // ref vehicle _ids
    "startDate": "2023-03-08",
    "endDate": "2023-03-09"
}


{
    "status": true,
    "message": "Booking completed successfully!"
}

another sample response for overlapping

{
    "status": false,
    "message": "Model not avalaible at this date"
}


















