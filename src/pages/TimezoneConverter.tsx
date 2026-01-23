import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Clock, RotateCcw, X, Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// All IANA timezones
const allTimezoneValues = [
  "Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara",
  "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre",
  "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta",
  "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala",
  "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg",
  "Africa/Juba", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa",
  "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi",
  "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane",
  "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey",
  "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli",
  "Africa/Tunis", "Africa/Windhoek",
  "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina",
  "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/Cordoba",
  "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza",
  "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan",
  "America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia",
  "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Bahia", "America/Bahia_Banderas",
  "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista",
  "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun",
  "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua",
  "America/Costa_Rica", "America/Creston", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn",
  "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica",
  "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Fort_Nelson", "America/Fortaleza",
  "America/Glace_Bay", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe",
  "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana",
  "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo",
  "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes",
  "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Juneau",
  "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Kralendijk", "America/La_Paz",
  "America/Lima", "America/Los_Angeles", "America/Lower_Princes", "America/Maceio", "America/Managua",
  "America/Manaus", "America/Marigot", "America/Martinique", "America/Matamoros", "America/Mazatlan",
  "America/Menominee", "America/Merida", "America/Metlakatla", "America/Mexico_City", "America/Miquelon",
  "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montserrat", "America/Nassau",
  "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Beulah",
  "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Nuuk", "America/Ojinaga",
  "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince",
  "America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Punta_Arenas",
  "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute",
  "America/Rio_Branco", "America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo",
  "America/Scoresbysund", "America/Sitka", "America/St_Barthelemy", "America/St_Johns", "America/St_Kitts",
  "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa",
  "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola",
  "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife",
  "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie",
  "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa",
  "Antarctica/Troll", "Antarctica/Vostok",
  "Arctic/Longyearbyen",
  "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat",
  "Asia/Atyrau", "Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Barnaul", "Asia/Beirut",
  "Asia/Bishkek", "Asia/Brunei", "Asia/Chita", "Asia/Choibalsan", "Asia/Colombo", "Asia/Damascus",
  "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Famagusta", "Asia/Gaza", "Asia/Hebron",
  "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura",
  "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kathmandu", "Asia/Khandyga",
  "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macau",
  "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk",
  "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang",
  "Asia/Qatar", "Asia/Qostanay", "Asia/Qyzylorda", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand",
  "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Srednekolymsk", "Asia/Taipei", "Asia/Tashkent",
  "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Tomsk", "Asia/Ulaanbaatar",
  "Asia/Urumqi", "Asia/Ust-Nera", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yangon",
  "Asia/Yekaterinburg", "Asia/Yerevan",
  "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faroe",
  "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley",
  "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Darwin", "Australia/Eucla",
  "Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth",
  "Australia/Sydney",
  "Europe/Amsterdam", "Europe/Andorra", "Europe/Astrakhan", "Europe/Athens", "Europe/Belgrade",
  "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest",
  "Europe/Busingen", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar",
  "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle_of_Man", "Europe/Istanbul", "Europe/Jersey",
  "Europe/Kaliningrad", "Europe/Kiev", "Europe/Kirov", "Europe/Lisbon", "Europe/Ljubljana", "Europe/London",
  "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco",
  "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga",
  "Europe/Rome", "Europe/Samara", "Europe/San_Marino", "Europe/Sarajevo", "Europe/Saratov", "Europe/Simferopol",
  "Europe/Skopje", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Ulyanovsk",
  "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd",
  "Europe/Warsaw", "Europe/Zagreb", "Europe/Zaporozhye", "Europe/Zurich",
  "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro",
  "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion",
  "Pacific/Apia", "Pacific/Auckland", "Pacific/Bougainville", "Pacific/Chatham", "Pacific/Chuuk",
  "Pacific/Easter", "Pacific/Efate", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos",
  "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Kiritimati",
  "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway",
  "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau",
  "Pacific/Pitcairn", "Pacific/Pohnpei", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan",
  "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Wake", "Pacific/Wallis",
  "UTC"
];

const allTimezones = allTimezoneValues.map((tz) => ({
  value: tz,
  label: tz.replace(/_/g, " ").replace(/\//g, " / "),
}));

const TimezoneConverter = () => {
  const { toast } = useToast();
  const [sourceTimezone, setSourceTimezone] = useLocalStorage("timezone_source", "Asia/Kolkata");
  const [sourceOpen, setSourceOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedTimezones, setSelectedTimezones] = useLocalStorage<string[]>("timezone_selected", [
    "UTC",
    "America/Santiago",
    "America/Lima",
    "America/Bogota",
  ]);
  const [inputTime, setInputTime] = useLocalStorage("timezone_inputTime", "");
  const [inputDate, setInputDate] = useLocalStorage("timezone_inputDate", new Date().toISOString().split("T")[0]);

  const availableTimezones = useMemo(() => {
    return allTimezones.filter(
      (tz) => !selectedTimezones.includes(tz.value) && tz.value !== sourceTimezone
    );
  }, [selectedTimezones, sourceTimezone]);

  const handleAddTimezone = (value: string) => {
    if (value && !selectedTimezones.includes(value)) {
      setSelectedTimezones([...selectedTimezones, value]);
      setAddOpen(false);
    }
  };

  const handleRemoveTimezone = (value: string) => {
    setSelectedTimezones(selectedTimezones.filter((tz) => tz !== value));
  };

  const getTimezoneLabel = (value: string) => {
    return value.replace(/_/g, " ").replace(/\//g, " / ");
  };

  const conversions = useMemo(() => {
    if (!inputTime || !inputDate) return [];

    try {
      const [hours, minutes] = inputTime.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return [];

      const dateTimeStr = `${inputDate}T${inputTime}:00`;
      const sourceDate = new Date(dateTimeStr);

      if (isNaN(sourceDate.getTime())) return [];

      const allTzValues = [
        sourceTimezone,
        ...selectedTimezones.filter((tz) => tz !== sourceTimezone),
      ];

      return allTzValues.map((tzValue) => {
        try {
          const formatted = new Intl.DateTimeFormat("en-US", {
            timeZone: tzValue,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            weekday: "short",
            month: "short",
            day: "numeric",
          }).format(sourceDate);

          const timePart = new Intl.DateTimeFormat("en-US", {
            timeZone: tzValue,
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(sourceDate);

          return {
            value: tzValue,
            label: getTimezoneLabel(tzValue),
            convertedTime: formatted,
            time24: timePart,
            isSource: tzValue === sourceTimezone,
          };
        } catch {
          return {
            value: tzValue,
            label: getTimezoneLabel(tzValue),
            convertedTime: "Error",
            time24: "--:--",
            isSource: false,
          };
        }
      });
    } catch {
      return [];
    }
  }, [inputTime, inputDate, sourceTimezone, selectedTimezones]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} time copied to clipboard`,
    });
  };

  const handleCopyAll = () => {
    if (conversions.length === 0) return;
    const text = conversions.map((c) => `${c.label}: ${c.convertedTime}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "All timezone conversions copied to clipboard",
    });
  };

  const handleSetNow = () => {
    const now = new Date();
    setInputDate(now.toISOString().split("T")[0]);
    const hours = now.getHours().toString().padStart(2, "0");
    const mins = now.getMinutes().toString().padStart(2, "0");
    setInputTime(`${hours}:${mins}`);
  };

  const handleReset = () => {
    setInputTime("");
    setInputDate(new Date().toISOString().split("T")[0]);
    setSourceTimezone("UTC");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-cyan/10 px-4 py-2 text-sm font-medium text-gradient-cyan mb-4">
            <Clock className="h-4 w-4" />
            Timezone Converter
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            World Clock Converter
          </h1>
          <p className="text-muted-foreground">
            Convert time between different timezones instantly
          </p>
        </div>

        {/* Input Section */}
        <div className="tool-card tool-card-cyan mb-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Source Timezone
              </label>
              <Popover open={sourceOpen} onOpenChange={setSourceOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={sourceOpen}
                    className="w-full justify-between bg-secondary border-border text-left font-normal"
                  >
                    <span className="truncate">{getTimezoneLabel(sourceTimezone)}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 bg-background border-border" align="start">
                  <Command>
                    <CommandInput placeholder="Search timezone..." />
                    <CommandList>
                      <CommandEmpty>No timezone found.</CommandEmpty>
                      <CommandGroup>
                        {allTimezones.map((tz) => (
                          <CommandItem
                            key={tz.value}
                            value={tz.label}
                            onSelect={() => {
                              setSourceTimezone(tz.value);
                              setSourceOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                sourceTimezone === tz.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {tz.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <Input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Time
              </label>
              <Input
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="gradient" onClick={handleSetNow}>
              <Clock className="h-4 w-4 mr-2" />
              Set Current Time
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            {conversions.length > 0 && (
              <Button variant="outline" onClick={handleCopyAll}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            )}
          </div>
        </div>

        {/* Add Timezones Section */}
        <div className="tool-card tool-card-purple mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Target Timezones
          </label>

          {/* Selected timezones as badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTimezones.map((tzValue) => (
              <Badge
                key={tzValue}
                variant="secondary"
                className="pl-3 pr-1 py-1.5 bg-secondary text-foreground flex items-center gap-2"
              >
                {getTimezoneLabel(tzValue)}
                <button
                  onClick={() => handleRemoveTimezone(tzValue)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            ))}
          </div>

          {/* Add timezone combobox */}
          {availableTimezones.length > 0 && (
            <Popover open={addOpen} onOpenChange={setAddOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={addOpen}
                  className="w-full sm:w-80 justify-between bg-secondary border-border text-left font-normal"
                >
                  <span className="text-muted-foreground">Add a timezone...</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0 bg-background border-border" align="start">
                <Command>
                  <CommandInput placeholder="Search timezone..." />
                  <CommandList>
                    <CommandEmpty>No timezone found.</CommandEmpty>
                    <CommandGroup>
                      {availableTimezones.map((tz) => (
                        <CommandItem
                          key={tz.value}
                          value={tz.label}
                          onSelect={() => handleAddTimezone(tz.value)}
                        >
                          {tz.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}

          {selectedTimezones.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Add timezones to see converted times
            </p>
          )}
        </div>

        {/* Results Grid */}
        {conversions.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {conversions.map((tz) => (
              <div
                key={tz.value}
                className={`tool-card group cursor-pointer transition-all ${
                  tz.isSource
                    ? "tool-card-cyan ring-2 ring-gradient-cyan"
                    : "tool-card-purple"
                }`}
                onClick={() => handleCopy(tz.convertedTime, tz.label)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {tz.label}
                      {tz.isSource && (
                        <span className="ml-2 text-xs bg-gradient-cyan/20 text-gradient-cyan px-2 py-0.5 rounded-full">
                          Source
                        </span>
                      )}
                    </p>
                    <p className="text-2xl font-bold text-foreground">{tz.time24}</p>
                    <p className="text-sm text-muted-foreground">{tz.convertedTime}</p>
                  </div>
                  <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}

        {inputTime && selectedTimezones.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Add timezones above to see conversions
          </div>
        )}

        {!inputTime && (
          <div className="text-center py-12 text-muted-foreground">
            Select a time to see it in your chosen timezones
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TimezoneConverter;
