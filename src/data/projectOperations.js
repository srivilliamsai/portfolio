// Scenes explain the responsibilities documented in each case study.
// This is a walkthrough, not a claim that work runs overnight.
const operations = {
  pitstop: {
    title:'What PitStop connects behind a request',
    steps:[
      ['LOCATE','Resolve the place','pin','A device location or a manually chosen place gives the request its map context.'],
      ['CHOOSE','Capture the service','grid','The service choice establishes the kind of roadside help the driver needs.'],
      ['ROUTE','Route the request','route','Spring Cloud Gateway sends the request to the relevant backend service.'],
      ['HANDLE','Handle the service domain','shield','The domain service handles its part of the roadside assistance flow.'],
      ['RECORD','Keep the order context','data','Order information and state remain connected to the original request.'],
      ['RETURN','Show the next state','check','The client presents the resulting request status to the driver.'],
    ],
  },
  'carbon-footprint': {
    title:'What Carbon Footprint does with an activity',
    steps:[
      ['ACTIVITY','Capture the activity','grid','The person supplies activity information to the tracker.'],
      ['PREPARE','Organize the inputs','document','The React interface prepares the values used in the calculation request.'],
      ['CALCULATE','Calculate on the server','calculator','Spring Boot handles the server-side footprint calculation.'],
      ['ESTIMATE','Return the estimate','data','The returned figure describes estimated emissions for the supplied activity.'],
      ['REVIEW','Show personal impact','chart','The dashboard presents the estimate in a form the person can review.'],
      ['FOLLOW','Put the goal in context','check','The annual view and tracking challenge give the result a longer-term reference.'],
    ],
  },
  wyndra: {
    title:'What Wyndra does for a weather view',
    steps:[
      ['PLACE','Resolve the location','pin','City search or LocationService establishes the place to look up.'],
      ['REQUEST','Ask for the weather','cloud','WeatherService handles the OpenWeather request for that place.'],
      ['MAP','Map the response','route','The response becomes the weather models used by the app.'],
      ['STATE','Update observable state','data','View models publish the conditions for SwiftUI to display.'],
      ['CACHE','Keep local weather data','document','CacheService retains local data to support subsequent views and fallback.'],
      ['EXPLORE','Present the conditions','chart','The overview and detail screens make humidity, pressure and visibility explorable.'],
    ],
  },
  glassora: {
    title:'What Glassora connects behind a wallpaper',
    steps:[
      ['CATALOG','Start with the catalog','grid','Bundled JSON provides a starting catalog for the native app.'],
      ['UPDATE','Read online metadata','cloud','Firestore supplies online wallpaper and category metadata.'],
      ['BROWSE','Find a wallpaper','route','Feed, categories and search connect a catalog entry to its detail screen.'],
      ['IMAGE','Load the image file','image','The image service fetches the wallpaper from Cloudflare R2 through the delivery layer.'],
      ['FAVORITE','Keep a favorite locally','data','Favorites and preferences are stored locally for the person to return to.'],
      ['SAVE','Finish with a native action','check','Share or download uses the platform’s supported native action.'],
    ],
  },
  dinedesk: {
    title:'What DineDesk connects during service',
    steps:[
      ['QUOTE','Calculate the bill','calculator','The backend provides authoritative totals for the order.'],
      ['KITCHEN','Route the kitchen ticket','grid','Station-routed KOT tickets carry preparation status and timers.'],
      ['CHECK','Validate the settlement','shield','Server checks enforce supported payment rules and duplicate-settlement safeguards.'],
      ['COMMIT','Record the settlement','data','A transaction keeps the finalized bill and payment records consistent.'],
      ['STOCK','Connect inventory movements','route','Recipe-based stock movements stay linked to the settled bill.'],
      ['RECEIPT','Prepare the receipt','document','The settled record feeds receipt formatting and the supported printing path.'],
    ],
  },
  'invoice-picker': {
    title:'What Invoice Picker connects behind an invoice',
    steps:[
      ['CLIENT','Reuse the client details','grid','Saved client records and rates reduce repeated billing entry.'],
      ['TOTALS','Calculate the document','calculator','Line items, tax and discounts shape the invoice totals.'],
      ['CACHE','Keep the local edit','data','The cache-first data layer stores the edit in user-scoped browser state.'],
      ['SYNC','Persist workspace records','cloud','Firestore handles background persistence within the signed-in account boundary.'],
      ['PDF','Create the document locally','document','html2pdf.js/jsPDF creates the export in the browser; cloud sync is a separate responsibility.'],
      ['HISTORY','Keep the invoice in context','check','Invoice history and dashboard summaries remain part of the same workspace.'],
    ],
  },
};
export const projectOperations=Object.fromEntries(Object.entries(operations).map(([id,operation])=>[id,{
  title:operation.title,
  steps:operation.steps.map(([label,title,icon,detail],index)=>({id:`operation-${index+1}`,label,title,icon,detail})),
}]));
