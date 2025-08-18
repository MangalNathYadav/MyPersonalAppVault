

/* Iteration 0 */
document.addEventListener('DOMContentLoaded', function() {
    const addAppButton = document.getElementById('add-app-button');
    const appForm = document.getElementById('app-form');
    const saveAppButton = document.getElementById('save-app-button');
    const cancelAppButton = document.getElementById('cancel-app-button');
    const appList = document.getElementById('app-list');

    addAppButton.addEventListener('click', function() {
        appForm.style.display = 'block';
    });

    cancelAppButton.addEventListener('click', function() {
        appForm.style.display = 'none';
    });

    saveAppButton.addEventListener('click', function() {
        const appName = document.getElementById('app-name').value;
        const appUrl = document.getElementById('app-url').value;

        if (appName && appUrl) {
            addAppToList(appName, appUrl);
            document.getElementById('app-name').value = '';
            document.getElementById('app-url').value = '';
            appForm.style.display = 'none';
        } else {
            alert('Please enter both application name and URL.');
        }
    });

    function addAppToList(name, url) {
        const appItem = document.createElement('div');
        appItem.classList.add('app-item');
        appItem.innerHTML = `<a href="${url}" target="_blank">${name}</a>`;
        appList.appendChild(appItem);
    }
});