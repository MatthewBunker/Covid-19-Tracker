import React from 'react'
import './Table.css'

function Table({countries}) {
    return <div className="table">
            <th className="header">
                <td><strong>Country</strong></td>
                <td><strong>Cases</strong></td>
            </th>
            {countries.map(({country, cases}) => (
                <tr>
                    <td><strong>{country}</strong></td>
                    <td><strong>{cases}</strong></td>
                </tr>
            ))}
        </div>;
}

export default Table
