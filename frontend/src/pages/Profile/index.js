import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FiPower, FiTrash2 } from 'react-icons/fi';
import logoImg from '../../assets/logo.svg';

import api from '../../services/api';
import './styles.css';

export default function Profile(){
    const history = useHistory();
    const [incidents, setIncidents] = useState([]);
    const ongId = localStorage.getItem('ongId');
    const ongName = localStorage.getItem('ongName');

    useEffect(() => {
        api.get('profile', {
            headers: {
                authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [ongId]);

    async function HandleDeleteIncident(id){
        try{
            await api.delete(`incidents/${id}`, {
                headers: {
                    authorization: ongId,
                }
            });

            setIncidents(incidents.filter(incident => incident.id !== id));
        }catch(err){
            alert('Erro ao deletar o caso');
        }
    }

    function HandleLogout(){
        localStorage.clear();

        history.push('/');
    }

    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be the Heroe"/>
                <span>Bem vinda, {ongName}</span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>

                <button type="button">
                    <FiPower onClick={HandleLogout} size={18} color="#E02041" />

                </button>

            </header>

            <h1>Casos Cadastrados</h1>
            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)}</p>

                        <button onClick={() => HandleDeleteIncident(incident.id)} type="button" >
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}