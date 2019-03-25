# EgoNow

Angular Material Table with multiple filtters and datasource is a cloud firestore database

**(Done)** The data table to show the following: Driver id – full name – phone number – account creation date – current status – Last driver vehicle balance – rating.
**(Done)** Filters can be a drop down or range with a min and max fields.
**(Done)** Driver status: a drop down of registration-vehicle / registration-uploads / registration-inspection / rejected / active / on-duty / on-ride /
**(Done)** Rating: a range selector
**(Done)** Filter the table using a date range (e.g. booking a flight ticket calendar filtration)
**(Done)** UI design Implementation
**(Todo)** Balance: a range selector
**(Todo)** Dismiss-able badges
**(Todo)** Pagination

The pagination would require some investigation on what is the best strategy to implement and how. As I have used firestore with this project, I could go with one of the following options:

Option 1: Client side
This is basically the approach you mentioned. Select all from a collection and count on the client side. This works well enough for small datasets but obviously doesn't work if the dataset is larger.

Option 2: Write-time best-effort
With this approach, you can use Cloud Functions to update a counter for each addition and deletion from the collection.
This works well for any dataset size, as long as additions/deletions only occur at the rate less than or equal to 1 per second. This gives you a single document to read to give you the most current count immediately.
If need to exceed 1 per second, you need to implement distributed counters per our documentation.

Option 3: Write-time exact
Rather than using Cloud Functions, in your client, you can update the counter at the same time as you add or delete a document. This means the counter will also be current, but you'll need to make sure to include this logic anywhere you add or delete documents.
Like option 2, you'll need to implement distributed counters if you want to exceed per second

Also, see this video: https://www.youtube.com/watch?v=poqTHxtDXwU