const fs = require('fs');
const path = require('path');
const { MongoClient, Binary } = require('mongodb');

async function retrievePapers(academicYear, semester, branch, subject) {
    const uri = 'mongodb://localhost:27017'; // MongoDB connection URI
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('college_papers_db11');

        const papers = await db.collection('years').find({
            academic_year: academicYear,
            'branches.name': branch,
            'branches.semesters.number': semester,
            'branches.semesters.subjects.name': subject
        }).toArray();

        if (papers.length > 0) {
            console.log('Papers found:');
            for (const branch of papers[0].branches) {
                for (const semester of branch.semesters) {
                    for (const subj of semester.subjects) {
                        if (subj.name === subject) {
                            for (const paper of subj.papers) {
                                const fileBuffer = paper.file instanceof Binary ? paper.file.buffer : paper.file;
                                const fileName = paper.title + '.pdf';
                                const outputFilePath = path.join(__dirname, fileName);
                                fs.writeFileSync(outputFilePath, fileBuffer);
                                console.log(`PDF file retrieved: ${fileName}`);
                            }
                        }
                    }
                }
            }
        } else {
            console.log('No papers found.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

// Example usage:
retrievePapers('1st year', 1, 'Computer Science', 'Data Structures');
retrievePapers('2nd year', 2, 'AIML', 'Probability');
