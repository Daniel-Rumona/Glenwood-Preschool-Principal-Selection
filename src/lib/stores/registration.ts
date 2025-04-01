import { writable } from 'svelte/store';

export const registrationForm = writable({
	personal: {
		name: '',
		surname: '',
		idNumber: '',
		gender: '',
		race: '',
		religion: '',
		province: '',
		address: '',
		postalCode: ''
	},
	experience: {
		qualifications: ['', '', ''],
		experience: '',
		workHistory: ['', '', '', ''],
		motivation: '',
		achievements: ''
	},
	uploads: {
		idCopy: null,
		cv: null,
		coverLetter: null,
		referral1: null,
		referral2: null,
		pastorLetter: null
	}
});