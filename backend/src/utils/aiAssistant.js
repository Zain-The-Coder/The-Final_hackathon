export const analyzeRequest = (text) => {
    const keywords = {
        'Web Dev': ['html', 'css', 'react', 'node', 'javascript', 'backend'],
        'UI/UX': ['figma', 'design', 'spacing', 'color', 'layout'],
        'Database': ['mongodb', 'sql', 'firebase', 'mongoose']
    };

    let detectedTags = [];
    let detectedCategory = 'General';
    let urgency = 'Low';

    for (const [cat, keys] of Object.entries(keywords)) {
        keys.forEach(key => {
            if (text.toLowerCase().includes(key)) {
                detectedTags.push(key);
                detectedCategory = cat;
            }
        });
    }

    const urgentWords = ['urgent', 'emergency', 'deadline', 'now', 'asap'];
    if (urgentWords.some(word => text.toLowerCase().includes(word))) {
        urgency = 'High';
    }

    return { 
        tags: [...new Set(detectedTags)], 
        category: detectedCategory, 
        urgency 
    };
};