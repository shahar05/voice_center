# voice_center


In order to run the project run the command: "npm start"

# Routes
 
  GET  - /api/voice-center/init-incoming-call 
  
        retrieving the data from the Voice Center API 
        and store it inside  OutgoingCalls Table which refers to Different_DB  Database
        
 POST - /api/voice-center/incoming-call
      
        Parser the XML File that should be sent from the Voice Center API
        the XML is organized by the presnted XML in the API Documentation.
        After retrieving that information cheking if this number was already was interact with IntercationsNEW Table.
        Update the "first_interaction" column in the DB
        insert the call details into OutgoingCalls Table 
     
     
 PATCH  - /api/voice-center/retroactive-interaction-update    
          
        This route is updating the calls of may record in the OutgoingCalls Table retroactively.
        after retrieving those calls checking if they are already exist 
        in the IntercationsNEW and change suitably the "first_interaction" column
            
