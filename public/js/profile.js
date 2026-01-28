document.getElementById('nameForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newName = document.getElementById('newName').value;
    
    if (!newName.trim()) {
        alert('Please enter a name');
        return;
    }
    
    try {
        const response = await fetch('/profile/update-name', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newName })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Name updated successfully!');
            location.reload();
        } else {
            alert(data.message || 'Failed to update name');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});

document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    try {
        const response = await fetch('/profile/update-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Password updated successfully!');
            document.getElementById('passwordForm').reset();
        } else {
            alert(data.message || 'Failed to update password');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});
