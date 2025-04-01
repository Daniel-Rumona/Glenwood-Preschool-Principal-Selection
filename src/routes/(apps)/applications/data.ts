import type { ComponentType } from "svelte";
import type { Icon } from "lucide-svelte";
import Vercel from "./(components)/icons/vercel.svelte";
import ICloud from "./(components)/icons/icloud.svelte";
import Gmail from "./(components)/icons/gmail.svelte";

export const applications = [
	{
		id: "app-001",
		name: "Thandi Mokoena",
		surname: "Mokoena",
		email: "thandi.mokoena@example.com",
		idNumber: "9001011234083",
		gender: "Female",
		race: "Black",
		religion: "Christian - Involved in church leadership and weekly services.",
		province: "Gauteng",
		address: "45 Mzansi Street, Soweto",
		postalCode: "1804",
		qualifications: [
			"University of Pretoria - B.Ed - 2013",
			"University of Johannesburg - M.Ed - 2017",
			"UNISA - Advanced Leadership Certificate - 2021"
		],
		experience: "12",
		workHistory: [
			"Hope Primary School - Educator - 2013–2016",
			"Sunrise High - HOD - 2017–2019",
			"Liberty Academy - Deputy Principal - 2020–Present"
		],
		motivation: `As a lifelong educator and committed leader, I believe I am ready to take on the role of principal...`,
		achievements: "Introduced a digital learning system... Mentored 5 interns... Led Science Expo victory.",
		uploads: {
			idCopy: "https://uploads.example.com/thandi-id.pdf",
			cv: "https://uploads.example.com/thandi-cv.pdf",
			certificates: "https://uploads.example.com/thandi-certs.pdf",
			referenceLetter: "https://uploads.example.com/thandi-pastor-letter.pdf",
			profilePicture: "https://uploads.example.com/thandi-pic.jpg",
			leadershipStyle: "Transformational Leadership – Focused on empowerment and accountability."
		},
		dateSubmitted: "2025-03-15T10:30:00Z",
		read: false
	},
	{
		id: "app-002",
		name: "Sipho Dlamini",
		surname: "Dlamini",
		email: "sipho.dlamini@example.com",
		idNumber: "8505055123084",
		gender: "Male",
		race: "Coloured",
		religion: "Muslim - Active in community outreach and madrassa programs.",
		province: "Western Cape",
		address: "23 Long Street, Cape Town",
		postalCode: "8001",
		qualifications: [
			"Cape Peninsula University - B.Ed - 2008",
			"Stellenbosch University - PGDE - 2011",
			"UCT - School Management Certificate - 2015"
		],
		experience: "15",
		workHistory: [
			"Ocean View Primary - Educator - 2009–2012",
			"Green Pastures - Grade Head - 2013–2016",
			"Unity School - Principal - 2017–Present"
		],
		motivation: `My journey has always been about impact...`,
		achievements: "Won WCED Best Principal Award 2021. Boosted attendance. Introduced language curriculum.",
		uploads: {
			idCopy: "https://uploads.example.com/sipho-id.pdf",
			cv: "https://uploads.example.com/sipho-cv.pdf",
			certificates: "https://uploads.example.com/sipho-certs.pdf",
			referenceLetter: "https://uploads.example.com/sipho-imam-letter.pdf",
			profilePicture: "https://uploads.example.com/sipho-pic.jpg",
			leadershipStyle: "Servant Leadership – Driven by compassion, clarity, and purpose."
		},
		dateSubmitted: "2025-03-17T14:45:00Z",
		read: true
	},
	{
		id: "app-003",
		name: "Naledi Khumalo",
		surname: "Khumalo",
		email: "naledi.khumalo@example.com",
		idNumber: "9103120051088",
		gender: "Female",
		race: "Black",
		religion: "Atheist",
		province: "KwaZulu-Natal",
		address: "12 Bayview Road, Durban",
		postalCode: "4001",
		qualifications: [
			"UKZN - B.Ed - 2012",
			"UCT - Honours in Educational Psychology - 2015"
		],
		experience: "11",
		workHistory: [
			"Durban Girls High - Educator - 2013–2016",
			"Phoenix Secondary - Counsellor - 2017–2020",
			"Coastal Academy - Deputy Principal - 2021–Present"
		],
		motivation: `I’m passionate about inclusive education and mental health in schools...`,
		achievements: "Launched school-wide mental health program. Improved learner retention by 22%.",
		uploads: {
			cv: "https://uploads.example.com/naledi-cv.pdf",
			idCopy: "https://uploads.example.com/naledi-id.pdf",
			profilePicture: "https://uploads.example.com/naledi-pic.jpg",
			leadershipStyle: "Democratic Leadership – Encourages collaboration and shared decision-making."
		},
		dateSubmitted: "2025-03-19T09:20:00Z",
		read: false
	},
	{
		id: "app-004",
		name: "Johan van Wyk",
		surname: "van Wyk",
		email: "johan.vw@example.com",
		idNumber: "7906245084085",
		gender: "Male",
		race: "White",
		religion: "Christian",
		province: "Free State",
		address: "77 Olive Avenue, Bloemfontein",
		postalCode: "9301",
		qualifications: [
			"UFS - B.Ed - 2004",
			"UFS - M.Ed - 2008"
		],
		experience: "20",
		workHistory: [
			"Central Primary - Educator - 2005–2009",
			"Vista High - Principal - 2010–2024"
		],
		motivation: `With two decades of experience, I’m seeking a new leadership challenge where I can mentor the next generation of educators.`,
		achievements: "Built a robotics lab. Partnered with rural schools for mentorship. Maintained 98% pass rate for 6 years.",
		uploads: {
			cv: "https://uploads.example.com/johan-cv.pdf",
			idCopy: "https://uploads.example.com/johan-id.pdf",
			profilePicture: "https://uploads.example.com/johan-pic.jpg",
			leadershipStyle: "Authoritative Leadership – Sets clear direction, but open to feedback."
		},
		dateSubmitted: "2025-03-20T13:00:00Z",
		read: true
	},
	{
		id: "app-005",
		name: "Aisha Patel",
		surname: "Patel",
		email: "aisha.patel@example.com",
		idNumber: "9401020043086",
		gender: "Female",
		race: "Indian",
		religion: "Hindu",
		province: "Limpopo",
		address: "89 Lotus Street, Polokwane",
		postalCode: "0700",
		qualifications: [
			"University of Limpopo - B.Ed - 2015",
			"UNISA - PGDE - 2018"
		],
		experience: "10",
		workHistory: [
			"Jupiter Primary - Educator - 2015–2018",
			"Rising Star Academy - Vice Principal - 2019–Present"
		],
		motivation: `I bring a unique blend of academic discipline and emotional intelligence...`,
		achievements: "Implemented learner-led peer tutoring. Received Provincial Education Excellence award in 2023.",
		uploads: {
			cv: "https://uploads.example.com/aisha-cv.pdf",
			idCopy: "https://uploads.example.com/aisha-id.pdf",
			profilePicture: "https://uploads.example.com/aisha-pic.jpg",
			leadershipStyle: "Coaching Leadership – Focused on development and empowerment."
		},
		dateSubmitted: "2025-03-21T08:50:00Z",
		read: false
	}
];

export type Application = (typeof applications)[number];

export type Account = {
	label: string;
	email: string;
	icon: ComponentType<Icon>;
};

export const accounts: Account[] = [
	{
		label: "Alicia Koch",
		email: "alicia@example.com",
		icon: Vercel,
	},
	{
		label: "Alicia Koch",
		email: "alicia@gmail.com",
		icon: Gmail,
	},
	{
		label: "Alicia Koch",
		email: "alicia@me.com",
		icon: ICloud,
	},
];

export const contacts = [
	{
		name: "Emma Johnson",
		email: "emma.johnson@example.com",
	},
	{
		name: "Liam Wilson",
		email: "liam.wilson@example.com",
	},
	{
		name: "Olivia Davis",
		email: "olivia.davis@example.com",
	},
	{
		name: "Noah Martinez",
		email: "noah.martinez@example.com",
	},
	{
		name: "Ava Taylor",
		email: "ava.taylor@example.com",
	},
	{
		name: "Lucas Brown",
		email: "lucas.brown@example.com",
	},
	{
		name: "Sophia Smith",
		email: "sophia.smith@example.com",
	},
	{
		name: "Ethan Wilson",
		email: "ethan.wilson@example.com",
	},
	{
		name: "Isabella Jackson",
		email: "isabella.jackson@example.com",
	},
	{
		name: "Mia Clark",
		email: "mia.clark@example.com",
	},
	{
		name: "Mason Lee",
		email: "mason.lee@example.com",
	},
	{
		name: "Layla Harris",
		email: "layla.harris@example.com",
	},
	{
		name: "William Anderson",
		email: "william.anderson@example.com",
	},
	{
		name: "Ella White",
		email: "ella.white@example.com",
	},
	{
		name: "James Thomas",
		email: "james.thomas@example.com",
	},
	{
		name: "Harper Lewis",
		email: "harper.lewis@example.com",
	},
	{
		name: "Benjamin Moore",
		email: "benjamin.moore@example.com",
	},
	{
		name: "Aria Hall",
		email: "aria.hall@example.com",
	},
	{
		name: "Henry Turner",
		email: "henry.turner@example.com",
	},
	{
		name: "Scarlett Adams",
		email: "scarlett.adams@example.com",
	},
];

export type Contact = (typeof contacts)[number];
