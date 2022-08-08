import { atom } from "jotai";
import { FaAndroid, FaCalculator, FaCapsules, FaJava, FaJedi, FaJira, FaLaravel, FaPython, FaReact, FaReacteurope, FaSwift, FaSwimmer, FaVuejs, FaWindows } from "react-icons/fa";


export const themeState = atom<'dark' | 'light'>('dark')

export interface IInfoState {
    shortName: string,
    longName: string,
    img: string,
    email: string,
    age: string
    tellno: string,
    location: string,
    status: string[]
}
export const infoState = atom({
    shortName: 'TeddyShem',
    longName: 'Teddy Shem Geda',
    img: './assets/owber.jpg',
    email: 'teddyshem100@gmail.com',
    age: (new Date()).getFullYear() - 2001 + " years old",
    tellno: '0720724960',
    location: 'Nairobi, Kenya',
    status: [
        'Currently working on personal projects and free for contracts',
        'Specifically working on an AI project i may be revealing soon if possible :)',
        'Thanks for peeping here !',
    ]
} as IInfoState)

export const languagesState = atom([
    { name: 'Python', icon: FaPython },
    { name: 'Java', icon: FaJava },
    { name: 'C++', icon: FaCalculator },
    { name: 'Javascript', icon: FaJedi },
    { name: 'Kotlin', icon: FaAndroid },
    { name: 'Swift', icon: FaSwift },
    { name: 'c#', icon: FaCapsules },
])

export const frameworkState = atom([
    { name: 'React', icon: FaReact },
    { name: 'Vue', icon: FaVuejs },
    { name: 'Javafx', icon: FaJira },
    { name: 'Swing', icon: FaSwimmer },
    { name: 'laravel', icon: FaLaravel },
    { name: 'R-Native', icon: FaReacteurope },
    { name: '.NET', icon: FaWindows },
])
export interface ISummaryState { name: string; level: number }
export const summaryState = atom([
    { name: 'HTML', level: 5 },
    { name: 'NODEJS', level: 5 },
    { name: 'PHP', level: 4 },
    { name: 'Django', level: 4 },
    { name: 'Flask', level: 5 },
    { name: 'Deno', level: 4 },
    { name: 'css', level: 5 },


])

export const iconColorsState = atom(get => {
    return get(themeState) === 'dark' ? ['white', 'grey'] : ['red', 'lavender'];
})

export const educationState = atom([
    { label: 'Tertiary', title: 'Multi Media', qualification: 'Comp science degree', duration: '2020-NOW', remarks: 'Nairobi, Kenya' },
    { label: 'Secondary', title: 'Kanga High', qualification: 'KCSE Cert.', duration: '2016-2019', remarks: 'Migori' },
    { label: 'Primary', title: 'Gedions Memorial', qualification: 'KCPE Cert.', duration: '2012-2015', remarks: 'Oyugis' },

])
export interface IWorkState {
    institution: string, start: string, duration: string, position: string, details: string[], avatar: string
}
export const workState = atom([
    {
        institution: "Lint Coop", start: '2020', duration: '- years', position: 'C.E.O', details: [
            '* Started the company as the home for my projects',
            '* To work on an AI project soon',
        ], avatar: 'owner.jpg',
    },
    {
        institution: "JRoze", start: '2018', duration: '2 years', position: 'Supervisor', details: [
            '* Followed up on attechees',
            '* Project lead for attachees',
        ], avatar: 'owner.jpg',
    },

] as IWorkState[])
export interface IProjectState {
    name: string, done: boolean, start: string,
    duration: string,
    description: string,
    link: string,
    screenshots: string[]
}

export const projectsState = atom([
    {
        name: 'Guyi', done: false, start: '2020', duration: '6 months', description: 'A website to build apps for all Major platforms from your browser', link: 'http://guyi.epizy.com',
        screenshots: [
            'assets/owner.jpg', 'assets/img1.jpg', 'assets/img2.jpg'
        ]
    },
    {
        name: 'MelAi', done: true, start: '2020', duration: '6 months', description: 'A website to build apps for all Major platforms from your browser', link: 'http://guyi.epizy.com',
        screenshots: [
            'assets/img1.jpg', 'assets/owner.jpg', 'assets/img2.jpg'
        ]
    },
    {
        name: 'Lint-Coop', done: false, start: '2020', duration: '6 months', description: 'A website to build apps for all Major platforms from your browser', link: 'http://guyi.epizy.com',
        screenshots: [
            'assets/img2.jpg', 'assets/owner.jpg', 'assets/img1.jpg',
            'assets/img2.jpg', 'assets/owner.jpg', 'assets/img1.jpg',
        ]
    },
    {
        name: 'JijiCoders', done: true, start: '2020', duration: '6 months', description: 'A website to build apps for all Major platforms from your browser', link: 'http://guyi.epizy.com',
        screenshots: [
            'assets/owner.jpg', 'assets/img1.jpg', 'assets/img2.jpg'
        ]
    },
] as IProjectState[])


