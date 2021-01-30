# Points System

This is a backend REST API that performs certain actions on the points in a user's account. Every user has certain Payers that are associated with the points.

## Actions that can be performed:

  - Add points to the user. 
      Example: add["DANNON", "300 points", "01/20 10:30 am"], 
      Explanation: 'Dannon' is the payer, '300' are the points associated with this add instruction for this particular payer and '01/20 10:30AM' is the timestamp.
      
  - Deduct points from user. 
      Example: ["5000"] 
      Explanation: This will deduct a total of 5000 points while keeping in mind all the constraints.
      
  - Get point balance of the user.
      Explanation: Returns the list of payer and their points at that time. 
	
## Routes:
  - **/points/add (POST)** : This route can be used to add points to the user
  - **/points/deduct (POST)** : This route can be used to deduct points from the user
  - **/points/balance (GET)** : This route can be used to get the total current balance of the user

## Constraints:
  - While deducting points, oldest points have to be deducted first.
  - User should not have negative balance for any Payer

## How to run:
  - To run locally:
      1.  Open the project folder in a terminal (root directory).
      2.  **`npm i`** 
      3.  **`npm run dev`**
  - Port 5000 is used for localhost.
  - The API is also deployed on **Heroku** and can be hit at: 
  - To run tests, run **`npm test`**. It will also provide the **code coverage**.
	-	The repository also has **Postman** Folder which can be imported in Postman to run the api
