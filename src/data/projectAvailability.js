// Public App Store compatibility snapshot, checked 6 November 2026.
// These minimum OS versions describe distribution, not a count of tested devices.
export const projectAvailability={
  glassora:{
    source:'https://apps.apple.com/in/app/glassora-wallpapers-hd-4k/id6777764126',
    checked:'2026-11-06',version:'0.1.6',
    platforms:[{name:'iPhone',minimum:'iOS 16.0'},{name:'iPad',minimum:'iPadOS 16.0'},{name:'Mac',minimum:'macOS 14.0'},{name:'Apple Vision',minimum:'visionOS 1.0'}],
  },
};
export const availabilityText=value=>`App Store snapshot checked ${value.checked}: version ${value.version}. Listed compatibility: ${value.platforms.map(item=>`${item.name}, ${item.minimum} or later`).join('; ')}. This lists platform families, not tested device models, installations or users. Store compatibility does not imply a separately documented native visionOS interface.`;
