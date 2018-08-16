function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Fitbit Account</Text>}>
        <Oauth
          settingsKey="oauth"
          title="Login"
          label="Fitbit"
          status="Login"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId="22CYYW"
          clientSecret="c0b5584d094705e838ebb55cde9640c3"
          scope="all"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
