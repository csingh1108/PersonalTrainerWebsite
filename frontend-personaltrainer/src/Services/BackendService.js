function backendService(url, method, jwt, requestBody) {
    const requestOptions = {
        method: method,
        headers: {
            'Content-type': 'application/json',
        },
    };

    if (jwt) {
        requestOptions.headers.Authorization = `Bearer ${jwt}`;
    }

    if (requestBody) {
        requestOptions.body = JSON.stringify(requestBody);
    }

    return fetch(url, requestOptions).then(async (response) => {
        const result = {
            status: response.status,
        };

        if (response.status === 204) {
            // For DELETE requests with no content, return an empty response
            result.type = 'none';
            result.data = null;
        } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const jsonData = await response.json();
                result.type = 'json';
                result.data = jsonData;
            } else {
                const textData = await response.text();
                result.type = 'text';
                result.data = textData;
            }
        }

        return result;
    });
}

export default backendService;
