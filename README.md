In this project, I created a system for managing queues and managing services for all types of providers.
For example, for barbers, they can create a user and enter their details: full name, address, etc. 
In addition they enter their working days, their working hours, and of course the services they offer: haircuts, haircuts with beard, hair coloring, etc.
Moreover, each provider enters the duration of their queues, for example, there are experienced barbers who makes an haircut for fifteen minutes while there are new barbers who will do it a little longer.
In addition, each provider can see all past queues and of course all future queues with the option to delete queue. For each queue, the provider see the details of the queue: date, time, and email of the person who booked the queue.
For future queues, the provider have the option to cancel the queue.
In addition, a barber can update all of his details except for services for which queues have already been booked and which cannot be changed or deleted.
When logging into the system, a temporary code is sent to the barber by email that is valid for only 5 minutes.
In addition, there is a login option for customers to view and cancel future queues, and also to see past queues. Customer login is also done using a one-time code sent to an email and valid for 5 minutes.
Finally, each provider has their own unique link where you can see the dates the provider works and the hours of queues available for customers.
When a customer makes an appointment, they enter their email and full name, and a temporary code, valid for 5 minutes is sent to their email.
Only after entering the code, the appointment finally saved for the customer.

Frontend .env file:
REACT_APP_SERVER_ENDPOINT = http://localhost:5000/api 
REACT_APP_NODE_ENV = development

Backend .env file:
DATABASE_URL=mysql://root@localhost:3306/queue-management
PORT=5000
JWT_SECRET=Very important secret
SALT_ROUNDS=10
