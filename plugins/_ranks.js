global.uprpg = {
	
role(nivele) {
nivele = parseInt(nivele)
if (isNaN(nivele)) return { name: '', nivele: '' }

const role = [
{ name: "Novice", nivele: 0 }, 
{ name: "Apprentice", level: 4 }, 
{ name: "Adept", nivele: 8 }, 
{ name: "Magus", level: 12 }, 
{ name: "Master", nivele: 16 }, 
{ name: "Guardian", level: 20 }, 
{ name: "Champion", nivele: 24 }, 
{ name: "Hero", level: 28 }, 
{ name: "Legend", nivele: 32 }, 
{ name: "Myth", level: 36 },
{ name: "Wizard", nivele: 48 }, 
{ name: "Archmage", level: 52 }, 
{ name: "Sage", nivele: 56 }, 
{ name: "Divine", level: 60 }, 
{ name: "All-Father", nivele: 100 }
];

return role.reverse().find(role => nivele >= role.nivele)
}
}
