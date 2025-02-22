import { Artwork } from "./artworkInterface";

export const artworks: Artwork[] = [
	{
		id: "1",
		title: "Mountain Stream at Dawn",
		src: "https://images.unsplash.com/photo-1548679847-1d4ff48016c7",
		orientation: "landscape",
		description:
			"Captured during the early hours of dawn, this mountain stream represents the raw beauty of untouched nature. The interplay of light and shadow creates a mesmerizing scene that invites viewers to pause and reflect on the tranquility of the natural world.",
		location: "Rocky Mountains, Colorado",
		camera: {
			model: "Sony A7III",
			settings: "f/2.8, 1/125s, ISO 100",
		},
		uploadDate: "2024-02-20T08:30:00Z",
		tags: ["Water Stream", "Brook", "Natural Water", "Landscape", "Mountains"],
		user: {
			id: "u1",
			name: "Alex Smith",
			avatar: "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			role: "Professional Photographer",
		},
		price: 2500000,
	},
	{
		"id": "2",
		"title": "City Skyline at Dusk",
		"src": "https://images.unsplash.com/photo-1502635994848-2eb3b4a38201?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "As daylight fades, the city transforms into a vibrant canvas of twinkling lights and urban silhouettes. The dusk creates a dramatic contrast between the illuminated skyscrapers and the darkening sky.",
		"location": "New York, USA",
		"camera": {
			"model": "Canon EOS R5",
			"settings": "f/4.0, 1/60s, ISO 200"
		},
		"uploadDate": "2024-03-15T17:45:00Z",
		"tags": ["City", "Skyline", "Dusk", "Urban"],
		"user": {
			"id": "u2",
			"name": "Jamie Lee",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Street Photographer"
		},
		price: 3000000,
	},
	{
		"id": "3",
		"title": "Forest Trail in Autumn",
		"src": "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "landscape",
		"description": "The forest comes alive with vibrant hues of red, orange, and yellow. A winding trail invites wanderers to explore the crisp, refreshing atmosphere of autumn.",
		"location": "Bavarian Forest, Germany",
		"camera": {
			"model": "Nikon D850",
			"settings": "f/5.6, 1/125s, ISO 400"
		},
		"uploadDate": "2024-04-05T09:20:00Z",
		"tags": ["Forest", "Autumn", "Trail", "Nature"],
		"user": {
			"id": "u3",
			"name": "Maria Gonzalez",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Nature Photographer"
		}, 
		price: 3500000,
	},
	{
		"id": "4",
		"title": "Desert Mirage",
		"src": "https://plus.unsplash.com/premium_photo-1673631128794-e9758e20e5a8?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "In the midst of arid landscapes, the shimmering heat gives rise to optical illusions that evoke mystery and wonder, capturing the stark beauty of the desert.",
		"location": "Sahara Desert, Africa",
		"camera": {
			"model": "Sony A7R IV",
			"settings": "f/8, 1/250s, ISO 100"
		},
		"uploadDate": "2024-04-12T11:00:00Z",
		"tags": ["Desert", "Mirage", "Heat", "Landscape"],
		"user": {
			"id": "u4",
			"name": "Liam Nguyen",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Travel Photographer"
		},
		price: 1000000,
	},
	{
		"id": "5",
		"title": "Ocean Waves Crashing",
		"src": "https://images.unsplash.com/photo-1474767821094-a8fe9d8c8fdd?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "landscape",
		"description": "The raw power of the ocean is beautifully frozen in time as colossal waves break against rugged cliffs, showcasing nature’s unbridled energy and grace.",
		"location": "Big Sur, California",
		"camera": {
			"model": "Fujifilm X-T4",
			"settings": "f/11, 1/500s, ISO 200"
		},
		"uploadDate": "2024-05-01T14:30:00Z",
		"tags": ["Ocean", "Waves", "Seascape", "Nature"],
		"user": {
			"id": "u5",
			"name": "Olivia Chen",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Seascape Photographer"
		},
		price: 1500000,
	},
	{
		"id": "6",
		"title": "Snowy Mountain Peaks",
		"src": "https://images.unsplash.com/photo-1558089551-95d707e6c13c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "Towering peaks dusted with pristine snow stand as a testament to nature’s grandeur. The crisp air and brilliant sky amplify the serene yet powerful landscape.",
		"location": "Swiss Alps, Switzerland",
		"camera": {
			"model": "Canon EOS 5D Mark IV",
			"settings": "f/9, 1/200s, ISO 100"
		},
		"uploadDate": "2024-05-10T07:15:00Z",
		"tags": ["Mountains", "Snow", "Alps", "Winter"],
		"user": {
			"id": "u6",
			"name": "Ethan Brown",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Landscape Photographer"
		},
		price: 2000000,
	},
	{
		"id": "7",
		"title": "Vibrant Flower Garden",
		"src": "https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "landscape",
		"description": "Lush, blooming flowers create a lively mosaic of colors and shapes. The garden exudes energy and beauty, inviting onlookers to lose themselves in its vibrant details.",
		"location": "Provence, France",
		"camera": {
			"model": "Nikon Z7 II",
			"settings": "f/3.5, 1/100s, ISO 250"
		},
		"uploadDate": "2024-06-02T10:00:00Z",
		"tags": ["Flowers", "Garden", "Colorful", "Nature"],
		"user": {
			"id": "u7",
			"name": "Sophia Martinez",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Macro Photographer"
		},
		price: 2300000,
	},
	{
		"id": "8",
		"title": "Rainy City Street",
		"src": "https://images.unsplash.com/photo-1503348379917-758650634df4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "Rain-soaked streets reflect neon signs and city lights, creating an atmospheric urban landscape. The scene captures the reflective mood and charm of a rainy evening.",
		"location": "Tokyo, Japan",
		"camera": {
			"model": "Sony A7 III",
			"settings": "f/2.0, 1/30s, ISO 800"
		},
		"uploadDate": "2024-06-15T20:10:00Z",
		"tags": ["Rain", "City", "Urban", "Night"],
		"user": {
			"id": "u8",
			"name": "Hiro Tanaka",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Street Photographer"
		},
		price: 5000000,
	},
	{
		"id": "9",
		"title": "Sunset Over the Lake",
		"src": "https://images.unsplash.com/photo-1514975440715-7b6852af4ee7?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "landscape",
		"description": "The sky bursts into a palette of warm colors as the sun sets, casting a gentle glow over a tranquil lake. The peaceful scene invites relaxation and introspection.",
		"location": "Lake Tahoe, USA",
		"camera": {
			"model": "Canon EOS R6",
			"settings": "f/7.1, 1/80s, ISO 320"
		},
		"uploadDate": "2024-07-04T19:30:00Z",
		"tags": ["Sunset", "Lake", "Reflection", "Nature"],
		"user": {
			"id": "u9",
			"name": "Isabella Rossi",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Landscape Photographer"
		},
		price: 2400000,
	},
	{
		"id": "10",
		"title": "Starry Night Sky",
		"src": "https://images.unsplash.com/photo-1595246965570-9684145def50?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "Under the cloak of night, countless stars glitter against the deep blue backdrop. The image captures the infinite expanse of the universe, inspiring wonder and curiosity.",
		"location": "Atacama Desert, Chile",
		"camera": {
			"model": "Sony A7S III",
			"settings": "f/2.0, 30s exposure, ISO 1600"
		},
		"uploadDate": "2024-07-20T23:00:00Z",
		"tags": ["Night", "Stars", "Astrophotography", "Universe"],
		"user": {
			"id": "u10",
			"name": "Noah Patel",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Astrophotographer"
		},
		price: 4000000,
	},
	{
		"id": "11",
		"title": "Countryside Road",
		"src": "https://images.unsplash.com/photo-1499796683658-b659bc751db1?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "landscape",
		"description": "The rustic charm of the countryside is on full display with a solitary road stretching between rolling fields and quaint farmhouses. The image evokes a sense of freedom and simplicity.",
		"location": "Tuscany, Italy",
		"camera": {
			"model": "Fujifilm X-Pro3",
			"settings": "f/6.3, 1/100s, ISO 200"
		},
		"uploadDate": "2024-08-10T16:20:00Z",
		"tags": ["Countryside", "Road", "Farms", "Landscape"],
		"user": {
			"id": "u11",
			"name": "Lara Schmidt",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Travel Photographer"
		},
		price: 4000000,
	},
	{
		"id": "12",
		"title": "Ancient Castle Ruins",
		"src": "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "Weathered stone walls and crumbling towers speak of bygone eras. The dramatic sky adds to the eerie charm of these forgotten castle ruins.",
		"location": "Scotland, UK",
		"camera": {
			"model": "Nikon D750",
			"settings": "f/5.6, 1/80s, ISO 400"
		},
		"uploadDate": "2024-08-22T13:50:00Z",
		"tags": ["Castle", "Ruins", "History", "Mystery"],
		"user": {
			"id": "u12",
			"name": "George King",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Historical Photographer"
		},
		price: 4000000,
	},
	{
		"id": "13",
		"title": "Lush Tropical Forest",
		"src": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "landscape",
		"description": "Dense foliage and a riot of green hues define this tropical forest. The light filters through the canopy, creating a magical interplay of shadow and brightness.",
		"location": "Costa Rica",
		"camera": {
			"model": "Olympus OM-D E-M1 Mark III",
			"settings": "f/4.0, 1/160s, ISO 320"
		},
		"uploadDate": "2024-09-05T12:00:00Z",
		"tags": ["Tropical", "Forest", "Green", "Nature"],
		"user": {
			"id": "u13",
			"name": "Emma Lopez",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Wildlife Photographer"
		},
		price: 4000000,
	},
	{
		"id": "14",
		"title": "Calm River Bend",
		"src": "https://images.unsplash.com/photo-1483959651481-dc75b89291f1?q=80&w=1849&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "A meandering river reflects the soft hues of a fading day. The scene exudes tranquility and invites viewers to savor the simplicity of nature's flow.",
		"location": "Loire Valley, France",
		"camera": {
			"model": "Canon EOS Rebel T8i",
			"settings": "f/5.0, 1/100s, ISO 400"
		},
		"uploadDate": "2024-09-18T15:40:00Z",
		"tags": ["River", "Calm", "Landscape", "Nature"],
		"user": {
			"id": "u14",
			"name": "Lucas Martin",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Landscape Photographer"
		},
		price: 4000000,
	},
	{
		"id": "15",
		"title": "Modern Architecture",
		"src": "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?q=80&w=1734&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "landscape",
		"description": "This image highlights the intersection of art and engineering. Clean geometric forms and expansive glass surfaces define a modern structure set against a clear sky.",
		"location": "Dubai, UAE",
		"camera": {
			"model": "Sony A6400",
			"settings": "f/8, 1/125s, ISO 200"
		},
		"uploadDate": "2024-10-03T10:30:00Z",
		"tags": ["Architecture", "Modern", "Design", "Urban"],
		"user": {
			"id": "u15",
			"name": "Ava Wilson",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Architectural Photographer"
		},
		price: 4000000,
	},
	{
		"id": "16",
		"title": "Misty Morning in the Valley",
		"src": "https://images.unsplash.com/photo-1582562478517-6f88924e668d?q=80&w=1827&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "Early morning mist envelops the valley, softening the landscape and lending an ethereal quality to the rolling hills and scattered trees. The quiet ambiance is both soothing and mysterious.",
		"location": "Yosemite Valley, USA",
		"camera": {
			"model": "Fujifilm X-T3",
			"settings": "f/3.2, 1/60s, ISO 250"
		},
		"uploadDate": "2024-10-15T06:45:00Z",
		"tags": ["Mist", "Morning", "Valley", "Nature"],
		"user": {
			"id": "u16",
			"name": "Mason Davis",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Landscape Photographer"
		},
		price: 4000000,
	},
	{
		"id": "17",
		"title": "Misty Morning in the Valley",
		"src": "https://images.unsplash.com/photo-1739184685124-d51952f4c550?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "Early morning mist envelops the valley, softening the landscape and lending an ethereal quality to the rolling hills and scattered trees. The quiet ambiance is both soothing and mysterious.",
		"location": "Yosemite Valley, USA",
		"camera": {
			"model": "Fujifilm X-T3",
			"settings": "f/3.2, 1/60s, ISO 250"
		},
		"uploadDate": "2024-10-15T06:45:00Z",
		"tags": ["Mist", "Morning", "Valley", "Nature"],
		"user": {
			"id": "u16",
			"name": "Mason Davis",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Landscape Photographer"
		},
		price: 4000000,
	},
	{
		"id": "18",
		"title": "Misty Morning in the Valley",
		"src": "https://images.unsplash.com/photo-1724012518041-c9ca91b186be?q=80&w=1915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		"orientation": "portrait",
		"description": "Early morning mist envelops the valley, softening the landscape and lending an ethereal quality to the rolling hills and scattered trees. The quiet ambiance is both soothing and mysterious.",
		"location": "Yosemite Valley, USA",
		"camera": {
			"model": "Fujifilm X-T3",
			"settings": "f/3.2, 1/60s, ISO 250"
		},
		"uploadDate": "2024-10-15T06:45:00Z",
		"tags": ["Mist", "Morning", "Valley", "Nature"],
		"user": {
			"id": "u16",
			"name": "Mason Davis",
			"avatar": "https://images.unsplash.com/photo-1739624079957-917135a9c545",
			"role": "Landscape Photographer"
		},
		price: 4000000,
	}

]

