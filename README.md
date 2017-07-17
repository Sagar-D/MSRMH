# MSRMH
Leave Encashment WebApp


Database Structure(MongoDB) :

1. userlogin : { "_id" : "emp1",
                 "password" : "sagar",
                 "admin" : true
               }
               
2. empdetails : { "_id" : "emp1",
                  "name" : "sagar",
                  "department" : "Accounts",
                  "designation" : "Accountant",
                  "permanant" : true,
                  "leaveDetails" : { "cl" : { "balance" : 3,
                                              "previousEncashment" : "15 1 2014"
                                            },
                                     "sl" : { "balance" : 7,
                                              "previousEncashment" : "16 1 2014" 
                                            },
                                     "el" : { "balance" : 120,
                                              "previousEncashment" : "20 6 2015"
                                            },
                                    "lop" : 0 
                                   } 
                  }
 
