import {projectStories} from './projectStories.js';

const specs = {
  pitstop: {
    title:'A driver requests roadside help',
    stages:[
      ['Service selected','The driver chooses the kind of roadside support they need.'],
      ['Read location','The client supplies the location and service context.'],
      ['Location ready?','A usable location is needed before the request can be placed.'],
      ['Create request','The backend handles the request within the relevant service domain.'],
      ['Follow status','The client presents the resulting request state.'],
      ['Set location','The driver supplies or corrects the location before trying again.'],
      ['Order record','The backend keeps the order context and state.'],
    ],branch:'retry',storeType:'store',
    client:'Driver · mobile app',core:'PitStop request flow',
    steps:[['Choose a service','CLIENT','The app captures the service choice.'],['Attach the location','MAP','The request includes the place where help is needed.'],['Process the request','API','The gateway routes the request to the relevant domain service.'],['Return the status','ORDER','The order state returns to the client.']],
    outputs:[['Request status','A visible next step for the driver.'],['Order context','A consistent record behind the service flow.']],
  },
  'carbon-footprint': {
    title:'Activity becomes a personal footprint estimate',
    stages:[['Enter activity','The person supplies activity information to the tracker.'],['Prepare inputs','The interface organizes the values for calculation.'],['Inputs complete?','The calculation needs the required activity information.'],['Calculate estimate','Server-side logic produces the estimated footprint.'],['Review impact','The dashboard puts the result into a personal context.'],['Update activity','The user fills or corrects the missing information.'],['Footprint result','The returned estimate is available for the dashboard and annual view.']],
    branch:'retry',storeType:'process',client:'Person · web app',core:'Carbon Footprint flow',
    steps:[['Record activity','INPUT','Capture the activity information used by the product.'],['Prepare the request','REACT','The interface organizes the inputs.'],['Calculate the footprint','API','Spring Boot handles the server-side calculation flow.'],['Present the result','VIEW','The dashboard and goal views show the estimate in context.']],
    outputs:[['Personal dashboard','A readable view of estimated impact.'],['Annual goal','A reference for following the product’s tracking challenge.']],
  },
  wyndra: {
    title:'A selected place becomes a weather view',
    stages:[['Select a place','Use a city search or permission-based device location.'],['Request weather','WeatherService asks the provider for the location’s weather.'],['Response ready?','The app needs usable weather data before presenting it.'],['Update app state','The weather response is mapped into observable state.'],['Explore conditions','SwiftUI presents the overview and detailed metrics.'],['Use cache or retry','A cached value can support the view; otherwise the person can retry.'],['Local cache','CacheService retains local weather data.']],
    branch:'join',storeType:'store',client:'Person · native iOS',core:'Wyndra weather pipeline',
    steps:[['Resolve the place','LOCATION','LocationService or city search establishes the place.'],['Request weather data','SERVICE','WeatherService handles the OpenWeather integration.'],['Update the view model','STATE','The response becomes observable application state.'],['Render the conditions','SWIFTUI','The current conditions and metric screens reflect that state.']],
    outputs:[['Weather overview','A quick check of the current conditions.'],['Metric detail','A deeper look at humidity, pressure or visibility.']],
  },
  glassora: {
    title:'A catalog choice becomes a wallpaper on the device',
    stages:[['Open the catalog','The person browses the feed, categories or search.'],['Read the catalog','Repositories provide wallpaper and category metadata.'],['Online update?','Fresh metadata can be requested when the network is available.'],['Open a wallpaper','The detail view loads the image through the image service.'],['Save or share','Native actions handle downloading, sharing or saving a favorite.'],['Use bundled catalog','Bundled JSON supplies a starting catalog while offline.'],['Images + favorites','Image files come from R2; favorites and preferences stay local.']],
    branch:'join',storeType:'store',client:'Person · native app',core:'Glassora content flow',
    steps:[['Load catalog metadata','CATALOG','Bundled data and Firestore feed the catalog repositories.'],['Choose a wallpaper','BROWSE','The feed, categories and search lead to a detail view.'],['Load the image','R2','The image service fetches the wallpaper through the CDN.'],['Use a native action','DEVICE','Share, favorite or download according to the platform.']],
    outputs:[['Wallpaper detail','The image is the focus of the screen.'],['Saved image or favorite','A native action finishes the discovery journey.']],
  },
  dinedesk: {
    title:'An order becomes a settled bill and receipt',
    stages:[['Take an order','Staff add items with table or takeaway context.'],['Get the quote','The backend calculates the authoritative totals.'],['Settlement valid?','Server checks enforce the supported settlement rules.'],['Commit settlement','A transaction records the supported payment and inventory changes.'],['Issue the receipt','The finalized bill feeds the receipt and operational views.'],['Review the bill','Invalid, duplicate or unsupported settlements need review.'],['SQLite records','Bills, payments, stock movements and audit history remain linked.']],
    branch:'retry',storeType:'store',client:'Cashier · desktop app',core:'DineDesk service flow',
    steps:[['Build the order','POS','The React client captures items and service context.'],['Route kitchen tickets','KDS','KOT tickets go to the appropriate kitchen station.'],['Validate settlement','SERVER','Authoritative quotes and duplicate-settlement checks protect the bill.'],['Commit and print','TRANSACTION','A supported settlement updates records and creates the receipt.']],
    outputs:[['Kitchen station','A ticket with preparation state and timing.'],['Receipt + stock records','The settled bill and its inventory movements.']],
  },
  'invoice-picker': {
    title:'Client and line items become a saved invoice and PDF',
    stages:[['Start an invoice','Choose a client and create the document.'],['Calculate totals','Line items, discounts and tax values shape the total.'],['Ready to export?','The person reviews the document and required values.'],['Save the invoice','The application stores the invoice in user-scoped state.'],['Export the PDF','The browser’s PDF engine creates the downloadable document.'],['Edit the document','Correct the invoice before completing the export.'],['Local + cloud record','The cache-first layer keeps local state with background Firestore persistence.']],
    branch:'retry',storeType:'store',client:'Freelancer · browser',core:'Invoice Picker workflow',
    steps:[['Reuse client details','CLIENT','Select billing details and reusable rates.'],['Build the document','EDITOR','Line items, tax, discounts and signature styling shape the invoice.'],['Save user-scoped state','CACHE','The local-first data layer keeps the record and syncs in the background.'],['Create the PDF','EXPORT','html2pdf.js/jsPDF exports the invoice in the browser.']],
    outputs:[['A4 invoice PDF','A document ready for the person to download.'],['Invoice history','The saved record remains part of the workspace.']],
  },
};

const flowHeadings={
  pitstop:'How a request moves through PitStop',
  'carbon-footprint':'How an activity becomes a footprint',
  wyndra:'How weather data reaches Wyndra',
  glassora:'How an image moves through Glassora',
  dinedesk:'How an order moves through DineDesk',
  'invoice-picker':'How an invoice moves through Invoice Picker',
};
export const projectDiagrams=Object.fromEntries(Object.entries(specs).map(([id,spec])=>{
  const positions=[['start',20,90,130,50],['process',205,90,140,50],['decision',410,65,150,100],['process',630,90,150,50],['end',850,90,130,50],['process',410,270,150,60],[spec.storeType,650,270,150,60]];
  const nodes=spec.stages.map(([title,detail],index)=>({id:`step-${index}`,type:positions[index][0],x:positions[index][1],y:positions[index][2],width:positions[index][3],height:positions[index][4],title,detail}));
  const edges=[
    {from:'step-0',to:'step-1',path:'M150 115 H205'},
    {from:'step-1',to:'step-2',path:'M345 115 H410'},
    {from:'step-2',to:'step-3',path:'M560 115 H630',label:'Yes',labelX:590,labelY:99},
    {from:'step-3',to:'step-4',path:'M780 115 H850'},
    {from:'step-2',to:'step-5',path:'M485 165 V270',label:'No',labelX:505,labelY:217},
    {from:'step-5',to:spec.branch==='join'?'step-3':'step-1',path:spec.branch==='join'?'M560 300 H600 V180 H705 V140':'M410 300 H275 V140',label:spec.branch==='join'?'Fallback':'Review',labelX:spec.branch==='join'?590:323,labelY:285},
    {from:'step-3',to:'step-6',path:'M705 140 V235 H725 V270',dashed:true},
  ];
  return [id,{title:spec.title,nodes,edges,walkthrough:{heading:flowHeadings[id],title:spec.core,client:spec.client,image:projectStories[id].hero[0],steps:spec.steps.map(([title,tag,detail])=>({title,tag,detail})),outputs:spec.outputs.map(([title,detail])=>({title,detail}))}}];
}));
