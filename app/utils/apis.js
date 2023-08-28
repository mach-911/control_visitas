export function libreApiGetNames(rut) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    return fetch(`https://api.libreapi.cl/rut/activities?rut=${rut}`, requestOptions)
        .then(response => response.json())
        .then(result =>  {
            if (result.data.name != undefined && result.data.name != "") {
                console.log(result.data.name)
                const splitname = result.data.name.split(' ');
                return splitname[0] + ' ' + splitname[2]
            } 
        })
        .catch(error => console.error('error', error));
}