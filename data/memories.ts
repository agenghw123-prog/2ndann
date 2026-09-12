// Optional: list ALL 37 filenames here in your preferred sequence.
// Leave empty to use natural filename order. Filenames are not assumed to be dates.
export const photoOrder: string[] = [];

export type MemoryOverride = { caption?: string; note?: string; alt?: string };
// Add personal details keyed by the original filename, for example:
// '1789211151912.jpg': { caption: 'Our little adventure', note: 'Your own memory.', alt: 'Describe the photograph.' }
export const memoryOverrides: Record<string, MemoryOverride> = {
  '1789211151912.jpg': { alt: 'A beach selfie together at sunset, holding grilled corn, with mountains across the bay.' },
  '1789211152057.jpg': { alt: 'A selfie together on the beach in matching navy and cream jackets.' },
  '1789211152078.jpg': { alt: 'Standing together on a wide sandy beach beneath a clear blue sky.' },
  '1789211152096.jpg': { alt: 'A smiling selfie together in the grandstand beside a racetrack.' },
  '1789211152118.jpg': { alt: 'Posing together among colorful seats overlooking a racetrack.' },
  '1789211152141.jpg': { alt: 'A selfie together on a rocky shore with water and hills behind us.' },
  '1789211152170.jpg': { alt: 'Standing side by side on a bright blue deck with a suspension bridge behind us.' },
  '1789211152208.jpeg': { alt: 'A playful indoor photo together, wearing a white top and a black-and-white checked shirt.' },
  '1789211152248.jpg': { alt: 'A nighttime selfie together wearing green jackets, with trees behind us.' },
  '1789211152283.jpg': { alt: 'Smiling across a restaurant table with a plate of food and a drink.' },
  '1789211152329.jpg': { alt: 'Making a playful face across a café table, wearing a blue shirt and black hijab.' },
  '1789211152380.jpg': { alt: 'Sitting together at a restaurant table with two large patterned bowls of food.' },
  '1789211152423.jpg': { alt: 'A close selfie together over a meal served in a blue bowl.' },
  '1789211152457.jpg': { alt: 'A close selfie together wearing motorcycle helmets.' },
  '1789211152491.jpg': { alt: 'Sitting together with bowls of food at a wooden restaurant table.' },
  '1789211152534.jpg': { alt: 'Leaning together for a playful selfie in front of a gray wall.' },
  '1789211152579.jpg': { alt: 'A relaxed indoor selfie together wearing casual T-shirts.' },
  '1789211152617.jpg': { alt: 'Sitting together at an outdoor table beneath leafy trees.' },
  '1789211152670.jpg': { alt: 'A smiling portrait in a restaurant, wearing a black hijab and blue shirt.' },
  '1789211152705.jpg': { alt: 'A selfie together across a café table with two drinks.' },
  '1789211152767.jpg': { alt: 'Standing side by side at night beside a tall iron fence.' },
  '1789211152824.jpg': { alt: 'A close selfie together under a green awning at night.' },
  '1789211152914.jpg': { alt: 'Leaning our heads together and making playful faces for the camera.' },
  '1789211152952.jpg': { alt: 'A sunny beach selfie together with a rocky cliff and blue sky behind us.' },
  '1789211153013.jpg': { alt: 'Standing together on a sandy beach beside a tall green cliff.' },
  '1789211153077.jpg': { alt: 'Posing together in matching blue jackets beside a leafy stone wall.' },
  '1789211153158.jpg': { alt: 'A selfie together over bowls of noodles at a wooden table.' },
  '1789211153222.jpg': { alt: 'A quiet close-up selfie together against a gray background.' },
  '1789211153278.jpg': { alt: 'A selfie together in a restaurant with pale brick arches behind us.' },
  '1789211153348.jpg': { alt: 'Sitting together over a meal in a brightly lit restaurant.' },
  '1789211153400.jpg': { alt: 'Smiling with ice cream while sitting on a lively street at night.' },
  '1789211153444.jpg': { alt: 'Sitting across the table with a meal and iced drinks.' },
  'IMG-20250906-WA0013.jpg': { alt: 'A playful portrait wearing glasses and a panda hat, with hands under the chin.' },
  'IMG-20260313-WA0012.jpg': { alt: 'Smiling indoors while holding a bouquet wrapped in pale paper.' },
  'IMG_20250416_165129_568.webp': { alt: 'Posing together in a room with wooden chairs, one standing behind the other.' },
  'poosebox-photo.jpg': { alt: 'Two matching photo booth strips of us posing and laughing together with a bouquet.' },
  'Screenshot_2025-06-27-16-39-36-174_com.miui.mediaviewer.jpg': { alt: 'A photo of us posing behind a pizza, framed by a colorful illustrated restaurant wall.' },
};

export const memoryQuestions = [
  'Do you remember this moment?', 'Remember this?', 'I still remember this day.',
  'One of those little moments.', 'Somehow, I remember how this felt.',
  'Look at us.', 'This was us.', 'Another tiny chapter.',
  'Would you believe this was already that long ago?',
];
export const memoryBreaks: Record<number, { title: string; text?: string }> = {
  5: { title: 'And somehow, time kept moving.' },
  10: { title: 'We didn’t notice it then,', text: 'but we were building something.' },
  15: { title: 'We were collecting stories', text: 'without realizing they would become memories.' },
  19: { title: 'Halfway through these photos.', text: 'And somehow, this isn’t even close to half of our memories.' },
  24: { title: 'Another day. Another place.', text: 'Still you.' },
  29: { title: 'I think that’s my favorite thing about us.', text: 'Even ordinary days somehow become stories.' },
  34: { title: 'Maybe love is partly this:', text: 'having someone beside you while life quietly happens.' },
};
