# voice_center


In order to run the project all you need to do is type:  npm start

# Routes
 
  GET  - /api/voice-center/init-incoming-call 
  
        retrieving the data from the Voice Center API 
        and store it inside  OutgoingCalls Table which refers to Different_DB  Database
        
 POST - /api/voice-center/incoming-call
      
     Parser the XML File that should be sent from the Voice Center API
     the XML is organized by the presnted XML in the API Documentation.
     after retrieving that information cheking if this number was already was interact with 
     ( in other words if this number is store in the IntercationsNEW Table )
     update the first_iteraction column correctly and 
     insert the call details into OutgoingCalls Table 
     
     
 PATCH  - /api/voice-center/retroactive-interaction-update    
          
          this path is updating the calls of may record in the OutgoingCalls Table retroactively.
          after retrieving those calls checking if they are already exist 
          in the IntercationsNEW and change suitably the first_iteraction column
            

      
