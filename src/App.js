import React, {Fragment, useState, useEffect} from 'react';
import Formulario from './components/Formulario';
import Cancion from './components/Cancion';
import Info from './components/Info';
import axios from 'axios';

function App() {

  //Definir useState
  const [busquedaletra, guardarBusquedaLetra] = useState({});
  const [letra, guardarLetra] = useState('');
  const [info, guardarInfo] = useState({});
  const [error, guardarError] = useState(false);

  useEffect(()=>{
    //comprobar si el objeto está vacio
    if(Object.keys(busquedaletra).length === 0) return;
    
    const consultarApiLetra = async () =>{
      //extraemos variables
      const {artista, cancion} = busquedaletra;
      const url = `https://api.lyrics.ovh/v1/${artista}/${cancion}`;
      const url2 = `https://www.theaudiodb.com/api/v1/json/1/search.php?s=${artista}`;

      //capturar si hay algún error
      axios.all([
        axios.get(url),
        axios.get(url2)
      ]).then(axios.spread((letra, informacion) => {
        guardarLetra(letra.data.lyrics);
        guardarInfo(informacion.data.artists[0]);
      })).catch(error => {
        guardarError(true);
      });
      
      guardarError(false);
    }
    consultarApiLetra();

  }, [busquedaletra]);

  return (
    <Fragment>
      <Formulario 
        guardarBusquedaLetra={guardarBusquedaLetra}
      />
      {error ?
          <p className="alert alert-danger text-center p-2">Ooops! I did it again! Por favor intentalo de nuevo</p>
        :
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-6">
                <Info
                  info={info}
                />
              </div>
              <div className="col-md-6">
                <Cancion 
                  letra={letra}
                />
              </div>
            </div>
          </div>
      }
    </Fragment>
  );
}

export default App;
