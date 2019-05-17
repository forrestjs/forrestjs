import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ app, ssr }) => ({
    appName: app.name,
    backendRoot: ssr.getRootUrl('/'),
})

const AppName = ({ appName, backendRoot }) => (
    <div>
        <h4>{appName}</h4>
        <h6>{backendRoot}</h6>
    </div>
)

export default connect(mapState)(AppName)
