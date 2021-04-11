const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    index(req, res) {
        const jobs = Job.get();
        const profile = Profile.get();
    
        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }
        // total de horas por dia de cada job
        let jobTotalHours = 0

        const updatedJobs = jobs.map((job) => {
        // chamando o remainingDays
        const remaining = JobUtils.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress';
        // somando a quantidade de status
        statusCount[status] += 1;    
        // total de horas por dia de cada job
        jobTotalHours = status == 'progress' ? jobTotalHours + Number(job['daily-hours']) : jobTotalHours

        if (status == 'progress') {
            jobTotalHours += Number(job['daily-hours'])
        }
        
        return {
            ...job, // espalhamento
            remaining, 
            status,
            budget : JobUtils.calculateBudget(job, profile["value-hour"]) // usar colchetes quando tem traço
            }
        })
        // qtd horas que quero trabalhar menos a quantidade de hroas de cada job em progress
            const freeHours = profile["hours-per-day"] - jobTotalHours;

            return res.render("index", { jobs: updatedJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
        },
};
